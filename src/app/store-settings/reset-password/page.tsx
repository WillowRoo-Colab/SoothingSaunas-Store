import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser, touchLastLogin } from "@/lib/supabase/auth";
import { requestPasswordReset, setNewPassword } from "./actions";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{
    token_hash?: string;
    type?: string;
    error?: string;
    sent?: string;
  }>;
}) {
  const { token_hash: tokenHash, type, error, sent } = await searchParams;

  if (tokenHash && type === "recovery") {
    const supabase = await createClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: "recovery",
    });

    if (verifyError) {
      redirect(
        `/store-settings/reset-password?error=${encodeURIComponent(verifyError.message)}`
      );
    }

    redirect("/store-settings/reset-password");
  }

  const user = await getSessionUser();

  if (user) {
    // Marks the start of this session — a password reset must not let 2FA
    // be skipped as "recently verified" from before the reset.
    await touchLastLogin(user.id);

    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
        <h1 className="font-display text-2xl text-charcoal">Set a new password</h1>

        {error ? (
          <p
            role="alert"
            className="mt-4 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {error}
          </p>
        ) : null}

        <form action={setNewPassword} className="mt-6 flex flex-col gap-4">
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
            Update password
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <h1 className="font-display text-2xl text-charcoal">Reset your password</h1>
      <p className="mt-1 text-sm text-charcoal/70">
        Enter your admin email and we&apos;ll send a reset link if it matches
        an account.
      </p>

      {sent === "1" ? (
        <p className="mt-4 rounded border border-silver bg-cream px-3 py-2 text-sm text-charcoal/70">
          If that email matches an admin account, a reset link is on its way.
        </p>
      ) : (
        <form action={requestPasswordReset} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className="rounded border border-silver px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="mt-2 rounded bg-charcoal px-4 py-2 font-medium text-cream transition-colors hover:bg-charcoal/90"
          >
            Send reset link
          </button>
        </form>
      )}
    </main>
  );
}
