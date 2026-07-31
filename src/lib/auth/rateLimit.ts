import "server-only";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  LOGIN_RATE_LIMIT_WINDOW_MS,
  LOGIN_RATE_LIMIT_MAX_ATTEMPTS,
  LOGIN_ATTEMPTS_CLEANUP_ODDS,
  LOGIN_ATTEMPTS_RETENTION_MS,
} from "./policy";

// Trusts x-forwarded-for as set by the hosting platform's edge (this project
// deploys to Vercel, which sets it reliably) — not meaningful for local
// requests that don't pass through a proxy.
export async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

async function countRecentFailures(identifier: string): Promise<number> {
  const supabase = createAdminClient();
  const since = new Date(Date.now() - LOGIN_RATE_LIMIT_WINDOW_MS).toISOString();

  const { count, error } = await supabase
    .from("admin_login_attempts")
    .select("id", { count: "exact", head: true })
    .eq("identifier", identifier)
    .eq("succeeded", false)
    .gte("created_at", since);

  if (error) throw error;
  return count ?? 0;
}

// Checked before calling supabase.auth.signInWithPassword — a generic
// "too many attempts" is shown regardless of which identifier tripped it, so
// the response never reveals whether the account exists.
export async function isLoginRateLimited(email: string, ip: string): Promise<boolean> {
  const [emailFailures, ipFailures] = await Promise.all([
    countRecentFailures(normalizeEmail(email)),
    countRecentFailures(`ip:${ip}`),
  ]);

  return (
    emailFailures >= LOGIN_RATE_LIMIT_MAX_ATTEMPTS ||
    ipFailures >= LOGIN_RATE_LIMIT_MAX_ATTEMPTS
  );
}

export async function recordLoginAttempt(
  email: string,
  ip: string,
  succeeded: boolean
): Promise<void> {
  const supabase = createAdminClient();

  const { error } = await supabase.from("admin_login_attempts").insert([
    { identifier: normalizeEmail(email), kind: "email", succeeded },
    { identifier: `ip:${ip}`, kind: "ip", succeeded },
  ]);

  if (error) throw error;

  // Opportunistic cleanup — no cron dependency, just a low-odds chance on
  // any given attempt so the table doesn't grow unbounded.
  if (Math.random() < 1 / LOGIN_ATTEMPTS_CLEANUP_ODDS) {
    const cutoff = new Date(Date.now() - LOGIN_ATTEMPTS_RETENTION_MS).toISOString();
    await supabase.from("admin_login_attempts").delete().lt("created_at", cutoff);
  }
}
