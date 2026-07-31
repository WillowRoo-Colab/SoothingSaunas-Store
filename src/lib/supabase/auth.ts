import "server-only";
import { createClient } from "./server";
import { createAdminClient } from "./admin";
import { MFA_REVERIFY_AFTER_MS } from "@/lib/auth/policy";

export type AdminRole = "owner" | "editor";
export type AdminStatus = "invited" | "active" | "suspended";

export interface AdminProfile {
  userId: string;
  email: string;
  displayName: string | null;
  role: AdminRole;
  phoneE164: string | null;
  mfaEnrolled: boolean;
  status: AdminStatus;
}

interface AdminProfileRow {
  user_id: string;
  email: string;
  display_name: string | null;
  role: AdminRole;
  phone_e164: string | null;
  mfa_enrolled: boolean;
  status: AdminStatus;
}

function toAdminProfile(row: AdminProfileRow): AdminProfile {
  return {
    userId: row.user_id,
    email: row.email,
    displayName: row.display_name,
    role: row.role,
    phoneE164: row.phone_e164,
    mfaEnrolled: row.mfa_enrolled,
    status: row.status,
  };
}

// This site now supports multiple named admin accounts (see admin_profiles),
// each with an individually attributable identity — no more "any Supabase
// session is the admin" shortcut. Every admin still needs a matching
// admin_profiles row with status 'active'; a Supabase session alone is not
// sufficient.
export async function requireAdminSession(): Promise<{
  user: { id: string; email?: string };
  profile: AdminProfile;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("admin_profiles")
    .select("user_id, email, display_name, role, phone_e164, mfa_enrolled, status")
    .eq("user_id", user.id)
    .maybeSingle<AdminProfileRow>();

  if (error) throw error;
  if (!data || data.status !== "active") {
    throw new Error("Not authenticated");
  }

  return { user, profile: toAdminProfile(data) };
}

// Raw session lookup, no admin_profiles check at all. Used only by the
// public admin auth pages (verify/accept-invite/reset-password) that
// intentionally run before an active-status gate would apply.
export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// Same pages' other need: read profile fields (phone, mfa_enrolled) without
// requireAdminSession's "status must be active" throw — an invited admin
// mid-enrollment isn't active yet, and that's expected here.
export async function getAdminProfile(userId: string): Promise<AdminProfile | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("admin_profiles")
    .select("user_id, email, display_name, role, phone_e164, mfa_enrolled, status")
    .eq("user_id", userId)
    .maybeSingle<AdminProfileRow>();

  if (error) throw error;
  return data ? toAdminProfile(data) : null;
}

// Self-healing for the accept-invite path: auth.admin.inviteUserByEmail()
// (creates the auth.users row) and the admin_profiles insert that follows it
// aren't one transaction. If a valid session ever shows up with no matching
// profile, create a minimal one rather than hard-failing the invite.
export async function ensureAdminProfile(
  userId: string,
  email: string
): Promise<AdminProfile> {
  const existing = await getAdminProfile(userId);
  if (existing) return existing;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("admin_profiles")
    .insert({ user_id: userId, email, role: "editor", status: "invited" })
    .select("user_id, email, display_name, role, phone_e164, mfa_enrolled, status")
    .single<AdminProfileRow>();

  if (error) throw error;
  return toAdminProfile(data);
}

// Owner-only actions (inviting/suspending admins, changing roles, the
// Textbelt key, login-security view) layer this on top of
// requireAdminSession rather than duplicating the active-status check.
export async function requireRole(role: AdminRole) {
  const session = await requireAdminSession();
  if (session.profile.role !== role) {
    throw new Error("Forbidden");
  }
  return session;
}

// Owner-only — every admin's profile, for the "Admins & Roles" screen.
export async function listAdminProfiles(): Promise<AdminProfile[]> {
  await requireRole("owner");

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("admin_profiles")
    .select("user_id, email, display_name, role, phone_e164, mfa_enrolled, status")
    .order("email")
    .returns<AdminProfileRow[]>();

  if (error) throw error;
  return (data ?? []).map(toAdminProfile);
}

// Distinct from requireAdminSession: this checks phone-verification
// freshness, not account status. Enforced primarily at the route level
// (src/proxy.ts) rather than inside every data-access function.
export async function isMfaFresh(userId: string): Promise<boolean> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("admin_mfa_verifications")
    .select("verified_at")
    .eq("user_id", userId)
    .maybeSingle<{ verified_at: string }>();

  if (error) throw error;
  if (!data) return false;

  return Date.now() - new Date(data.verified_at).getTime() < MFA_REVERIFY_AFTER_MS;
}
