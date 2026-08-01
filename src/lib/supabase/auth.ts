import "server-only";
import { createClient } from "./server";
import { createAdminClient } from "./admin";

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
  lastLoginAt: string | null;
}

interface AdminProfileRow {
  user_id: string;
  email: string;
  display_name: string | null;
  role: AdminRole;
  phone_e164: string | null;
  mfa_enrolled: boolean;
  status: AdminStatus;
  last_login_at: string | null;
}

const PROFILE_COLUMNS =
  "user_id, email, display_name, role, phone_e164, mfa_enrolled, status, last_login_at";

function toAdminProfile(row: AdminProfileRow): AdminProfile {
  return {
    userId: row.user_id,
    email: row.email,
    displayName: row.display_name,
    role: row.role,
    phoneE164: row.phone_e164,
    mfaEnrolled: row.mfa_enrolled,
    status: row.status,
    lastLoginAt: row.last_login_at,
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
    .select(PROFILE_COLUMNS)
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
    .select(PROFILE_COLUMNS)
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
    .select(PROFILE_COLUMNS)
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
    .select(PROFILE_COLUMNS)
    .order("email")
    .returns<AdminProfileRow[]>();

  if (error) throw error;
  return (data ?? []).map(toAdminProfile);
}

// MFA freshness is tied to *this specific login*, not a rolling time window:
// fresh only if the last successful 2FA check happened at or after the most
// recent sign-in. A brand new session (password login, invite acceptance,
// password reset) always requires 2FA again, however recently it was last
// done — staying continuously signed in does not re-prompt repeatedly.
// Pure/sync so callers (src/proxy.ts) that already fetched both timestamps
// don't need a second round trip.
export function isMfaFresh(verifiedAt: string | null, lastLoginAt: string | null): boolean {
  if (!verifiedAt || !lastLoginAt) return false;
  return new Date(verifiedAt).getTime() >= new Date(lastLoginAt).getTime();
}

// Stamps "a new session started now" — called from every place a session is
// (re)established: password sign-in, invite acceptance, password reset.
// Whatever admin_mfa_verifications.verified_at held before this becomes
// stale relative to the new value, forcing 2FA again via isMfaFresh above.
export async function touchLastLogin(userId: string): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin
    .from("admin_profiles")
    .update({ last_login_at: new Date().toISOString() })
    .eq("user_id", userId);

  if (error) throw error;
}
