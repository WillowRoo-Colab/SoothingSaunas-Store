import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseEnv } from "@/lib/supabase/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { MFA_REVERIFY_AFTER_MS, IDLE_TIMEOUT_MS } from "@/lib/auth/policy";

// Previously this only checked "is there any authenticated Supabase
// session" — a holdover from the single-hardcoded-admin-account model. Now
// that admin accounts are individually attributable (admin_profiles) with
// SMS 2FA (admin_mfa_verifications), a live session alone is no longer
// sufficient: the account must also be 'active' (not suspended) and have a
// fresh phone verification.
const PUBLIC_ADMIN_PATHS = [
  "/store-settings/login",
  "/store-settings/verify",
  "/store-settings/accept-invite",
  "/store-settings/reset-password",
];

const LAST_SEEN_COOKIE = "ss_last_seen";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/store-settings");
  const isPublicAdminPath = PUBLIC_ADMIN_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (!isAdminRoute || isPublicAdminPath) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseEnv.url, supabaseEnv.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/store-settings/login", request.url));
  }

  const admin = createAdminClient();

  const { data: profile } = await admin
    .from("admin_profiles")
    .select("status")
    .eq("user_id", user.id)
    .maybeSingle<{ status: string }>();

  if (!profile || profile.status !== "active") {
    const url = new URL("/store-settings/login", request.url);
    url.searchParams.set(
      "error",
      "This account isn't active. Contact an owner if you believe this is a mistake."
    );
    return NextResponse.redirect(url);
  }

  const { data: mfaRow } = await admin
    .from("admin_mfa_verifications")
    .select("verified_at")
    .eq("user_id", user.id)
    .maybeSingle<{ verified_at: string }>();

  const mfaFresh =
    !!mfaRow &&
    Date.now() - new Date(mfaRow.verified_at).getTime() < MFA_REVERIFY_AFTER_MS;

  if (!mfaFresh) {
    return NextResponse.redirect(new URL("/store-settings/verify", request.url));
  }

  // App-level idle timeout — independent of (and shorter than) Supabase's
  // own JWT/refresh expiry. A forged/stale cookie can only avoid this
  // logout early; it can never substitute for the real session or the MFA
  // check above.
  const lastSeen = request.cookies.get(LAST_SEEN_COOKIE)?.value;
  const now = Date.now();
  if (lastSeen && now - Number(lastSeen) > IDLE_TIMEOUT_MS) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/store-settings/login", request.url));
  }

  response.cookies.set(LAST_SEEN_COOKIE, String(now), {
    httpOnly: true,
    sameSite: "lax",
    path: "/store-settings",
  });

  return response;
}

export const config = {
  matcher: ["/store-settings/:path*"],
};
