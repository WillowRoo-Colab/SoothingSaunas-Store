import fs from "fs";
import { createClient } from "@supabase/supabase-js";
const env = {};
for (const line of fs.readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const admin = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, { auth: { persistSession: false, autoRefreshToken: false } });

const { data: profiles } = await admin.from("admin_profiles").select("user_id, email, mfa_enrolled, phone_e164, status").not("email", "ilike", "claude-test%");
console.log("Profiles:", JSON.stringify(profiles, null, 2));

for (const p of profiles ?? []) {
  const { data: mfa } = await admin.from("admin_mfa_verifications").select("verified_at").eq("user_id", p.user_id).maybeSingle();
  const { data: totp } = await admin.from("admin_totp_secrets").select("verified_at, created_at").eq("user_id", p.user_id).maybeSingle();
  const ageMs = mfa ? Date.now() - new Date(mfa.verified_at).getTime() : null;
  console.log(`\n${p.email}:`);
  console.log("  mfa_verifications.verified_at:", mfa?.verified_at, ageMs ? `(${(ageMs/1000/60).toFixed(1)} min ago)` : "(none)");
  console.log("  totp_secrets:", JSON.stringify(totp));
}
