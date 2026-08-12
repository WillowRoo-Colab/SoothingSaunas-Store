import { requireRole } from "@/lib/supabase/auth";
import { createAdminClient } from "@/lib/supabase/admin";

interface LoginAttemptRow {
  id: string;
  identifier: string;
  kind: "email" | "ip";
  succeeded: boolean;
  created_at: string;
  user_agent: string | null;
  ip_country: string | null;
  ip_region: string | null;
  ip_city: string | null;
}

function formatLocation(attempt: LoginAttemptRow): string {
  const parts = [attempt.ip_city, attempt.ip_region, attempt.ip_country].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "—";
}

// A minimal read-only view for now — a fuller unified activity feed
// (security actions + settings publishes together) is planned as a later
// milestone; this covers the immediate "can I see recent login activity"
// need.
export default async function LoginSecurityPage() {
  await requireRole("owner");

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("admin_login_attempts")
    .select("id, identifier, kind, succeeded, created_at, user_agent, ip_country, ip_region, ip_city")
    .order("created_at", { ascending: false })
    .limit(50)
    .returns<LoginAttemptRow[]>();

  if (error) throw error;
  const attempts = data ?? [];

  return (
    <div className="max-w-5xl">
      <h2 className="font-display text-lg text-charcoal">Recent login attempts</h2>
      <p className="mt-1 text-sm text-charcoal/60">
        Most recent 50, across all admins. 5 failures on the same email or IP
        within 15 minutes blocks further attempts temporarily. Location and
        device are best-effort — unavailable in local dev, and often absent
        or misleading for Tor/VPN traffic.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-silver text-charcoal/60">
              <th className="py-2 pr-4 font-medium">When</th>
              <th className="py-2 pr-4 font-medium">Identifier</th>
              <th className="py-2 pr-4 font-medium">Result</th>
              <th className="py-2 pr-4 font-medium">Location</th>
              <th className="py-2 font-medium">Device / browser</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((attempt) => (
              <tr key={attempt.id} className="border-b border-silver/60">
                <td className="py-2 pr-4 whitespace-nowrap text-charcoal/70">
                  {new Date(attempt.created_at).toLocaleString()}
                </td>
                <td className="py-2 pr-4 font-mono text-xs">{attempt.identifier}</td>
                <td className="py-2 pr-4">
                  {attempt.succeeded ? (
                    <span className="text-green-700">Succeeded</span>
                  ) : (
                    <span className="text-red-600">Failed</span>
                  )}
                </td>
                <td className="py-2 pr-4 text-charcoal/70">{formatLocation(attempt)}</td>
                <td className="py-2 max-w-xs truncate text-xs text-charcoal/70" title={attempt.user_agent ?? ""}>
                  {attempt.user_agent ?? "—"}
                </td>
              </tr>
            ))}
            {attempts.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-4 text-center text-charcoal/50">
                  No login attempts recorded yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
