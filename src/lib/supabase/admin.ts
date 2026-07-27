import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { supabaseEnv } from "./env";

// Privileged client using the secret key — bypasses RLS entirely.
// MUST NOT be called until the caller has independently verified an admin
// session exists (see requireAdminSession in ./auth). Never expose this
// client or its key to client-side code.
export function createAdminClient() {
  return createSupabaseClient(supabaseEnv.url, supabaseEnv.secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
