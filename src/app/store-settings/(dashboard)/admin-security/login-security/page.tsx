import { requireRole } from "@/lib/supabase/auth";
import { createAdminClient } from "@/lib/supabase/admin";

interface LoginAttemptRow {
  id: string;
  identifier: string;
  kind: "email" | "ip";
  succeeded: boolean;
  created_at: string;
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
    .select("id, identifier, kind, succeeded, created_at")
    .order("created_at", { ascending: false })
    .limit(50)
    .returns<LoginAttemptRow[]>();

  if (error) throw error;
  const attempts = data ?? [];

  return (
    <div className="max-w-2xl">
      <h2 className="font-display text-lg text-charcoal">Recent login attempts</h2>
      <p className="mt-1 text-sm text-charcoal/60">
        Most recent 50, across all admins. 5 failures on the same email or IP
        within 15 minutes blocks further attempts temporarily.
      </p>

      <table className="mt-4 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-silver text-charcoal/60">
            <th className="py-2 pr-4 font-medium">When</th>
            <th className="py-2 pr-4 font-medium">Identifier</th>
            <th className="py-2 font-medium">Result</th>
          </tr>
        </thead>
        <tbody>
          {attempts.map((attempt) => (
            <tr key={attempt.id} className="border-b border-silver/60">
              <td className="py-2 pr-4 text-charcoal/70">
                {new Date(attempt.created_at).toLocaleString()}
              </td>
              <td className="py-2 pr-4 font-mono text-xs">{attempt.identifier}</td>
              <td className="py-2">
                {attempt.succeeded ? (
                  <span className="text-green-700">Succeeded</span>
                ) : (
                  <span className="text-red-600">Failed</span>
                )}
              </td>
            </tr>
          ))}
          {attempts.length === 0 ? (
            <tr>
              <td colSpan={3} className="py-4 text-center text-charcoal/50">
                No login attempts recorded yet.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
