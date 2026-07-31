import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

const TEXTBELT_BASE_URL = "https://textbelt.com";
const REQUEST_TIMEOUT_MS = 10_000;
const CREDENTIAL_KEY = "textbelt";

interface IntegrationCredentialRow {
  secret_value: string;
  metadata: { purchasedQuotaTotal?: number } | null;
  updated_at: string;
  updated_by: string | null;
}

async function getTextbeltKey(): Promise<string | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("integration_credentials")
    .select("secret_value")
    .eq("key", CREDENTIAL_KEY)
    .maybeSingle<Pick<IntegrationCredentialRow, "secret_value">>();

  if (error) throw error;
  return data?.secret_value ?? null;
}

async function fetchWithTimeout(url: string, init?: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

export interface SendSmsResult {
  success: boolean;
  quotaRemaining?: number;
  error?: string;
}

// Never throws — third-party SMS delivery failing must never crash a login
// or admin-security action. Callers get a normalized result and decide what
// to show the admin.
export async function sendSms(phone: string, message: string): Promise<SendSmsResult> {
  try {
    const key = await getTextbeltKey();
    if (!key) {
      return { success: false, error: "No Textbelt API key is configured." };
    }

    const response = await fetchWithTimeout(`${TEXTBELT_BASE_URL}/text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, message, key }),
    });

    const json = (await response.json()) as {
      success?: boolean;
      quotaRemaining?: number;
      error?: string;
    };

    if (!json.success) {
      return { success: false, error: json.error ?? "Textbelt declined to send the message." };
    }

    return { success: true, quotaRemaining: json.quotaRemaining };
  } catch {
    return { success: false, error: "Could not reach Textbelt (timeout or network error)." };
  }
}

export type TextbeltQuotaResult =
  | { ok: true; quotaRemaining: number; purchasedQuotaTotal: number | null }
  | { ok: false; error: string };

// Verified against the live Textbelt API: GET /quota/{key} returns only
// quotaRemaining — there is no "total purchased" field. purchasedQuotaTotal
// is whatever the admin has manually recorded (see updateTextbeltKey), not
// something Textbelt itself tracks, so it can drift if a key is topped up
// without updating that value here.
export async function checkTextbeltQuota(): Promise<TextbeltQuotaResult> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("integration_credentials")
      .select("secret_value, metadata")
      .eq("key", CREDENTIAL_KEY)
      .maybeSingle<Pick<IntegrationCredentialRow, "secret_value" | "metadata">>();

    if (error) throw error;
    if (!data) return { ok: false, error: "No Textbelt API key is configured." };

    const response = await fetchWithTimeout(`${TEXTBELT_BASE_URL}/quota/${data.secret_value}`);
    const json = (await response.json()) as { success?: boolean; quotaRemaining?: number };

    if (!json.success || typeof json.quotaRemaining !== "number") {
      return { ok: false, error: "Textbelt did not return a quota for this key." };
    }

    return {
      ok: true,
      quotaRemaining: json.quotaRemaining,
      purchasedQuotaTotal: data.metadata?.purchasedQuotaTotal ?? null,
    };
  } catch {
    return { ok: false, error: "Could not reach Textbelt (timeout or network error)." };
  }
}

// Admin-only — never returns the raw key to the caller, only a masked form
// safe to render in a Server Component.
export async function getMaskedTextbeltKey(): Promise<string | null> {
  const key = await getTextbeltKey();
  if (!key) return null;
  return key.length <= 4 ? "••••" : `${"•".repeat(key.length - 4)}${key.slice(-4)}`;
}

export async function updateTextbeltKey(
  newKey: string,
  purchasedQuotaTotal: number | null,
  updatedBy: string
): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("integration_credentials").upsert({
    key: CREDENTIAL_KEY,
    secret_value: newKey,
    metadata: { purchasedQuotaTotal },
    updated_at: new Date().toISOString(),
    updated_by: updatedBy,
  });

  if (error) throw error;
}
