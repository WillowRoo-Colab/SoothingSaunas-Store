import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseEnv } from "./env";

// Session-aware client for Server Components / Server Actions / Route
// Handlers. Uses the publishable key and respects the logged-in user's
// session — NOT for privileged data operations (see admin.ts for that).
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseEnv.url, supabaseEnv.publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component with no response to write to —
          // safe to ignore as long as middleware also refreshes sessions.
        }
      },
    },
  });
}
