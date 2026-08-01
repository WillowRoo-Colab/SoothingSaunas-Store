import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser, ensureAdminProfile, touchLastLogin } from "@/lib/supabase/auth";
import { setInvitePassword } from "./actions";

export default async function AcceptInvitePage({
  searchParams,
}: {
  searchParams: Promise<{ token_hash?: string; type?: string; error?: string }>;
}) {
  const { token_hash: tokenHash, type, error } = await searchParams;

  // Supabase's invite email link lands here once with token_hash+type in
  // the query string. Exchanging it establishes a real session, then we
  // redirect to the clean URL so a page refresh doesn't try to re-consume
  // an already-used token.
  if (tokenHash && type === "invite") {
    const supabase = await createClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: "invite",
    });

    if (verifyError) {
      redirect(
        `/store-settings/accept-invite?error=${encodeURIComponent(verifyError.message)}`
      );
    }

    redirect("/store-settings/accept-invite");
  }

  const user = await getSessionUser();

  if (!user) {
    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
        <h1 className="font-display text-2xl text-charcoal">Invite link invalid</h1>
        <p className="mt-4 text-sm text-charcoal/70">
          This invite link is invalid or has expired. Ask an owner to send a
          new one.
        </p>
      </main>
    );
  }

  await ensureAdminProfile(user.id, user.email ?? "");
  // Marks the start of this session so the mandatory phone enrollment right
  // after this counts as satisfying a fresh login (see touchLastLogin).
  await touchLastLogin(user.id);

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <h1 className="font-display text-2xl text-charcoal">Set your password</h1>
      <p className="mt-1 text-sm text-charcoal/70">
        You&apos;ll set up SMS verification next.
      </p>

      {error ? (
        <p
          role="alert"
          className="mt-4 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      ) : null}

      <form action={setInvitePassword} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium">
            New password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="rounded border border-silver px-3 py-2"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="rounded border border-silver px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="mt-2 rounded bg-charcoal px-4 py-2 font-medium text-cream transition-colors hover:bg-charcoal/90"
        >
          Continue
        </button>
      </form>
    </main>
  );
}
