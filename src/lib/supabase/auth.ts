import "server-only";
import { createClient } from "./server";

// This site has exactly one admin account, created directly in the Supabase
// dashboard with no public sign-up surface. Any authenticated session is
// therefore the admin — no separate roles table needed.
export async function requireAdminSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  return user;
}
