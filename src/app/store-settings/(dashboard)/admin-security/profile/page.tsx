import { requireAdminSession } from "@/lib/supabase/auth";
import { isTotpEnrolled } from "@/lib/auth/totp";
import { sendEnrollmentCode } from "@/app/store-settings/verify/actions";
import { updateDisplayName, beginTotpEnrollment, disableTotp } from "./actions";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";

function maskPhone(phone: string | null): string {
  if (!phone) return "Not set";
  return phone.length <= 4 ? phone : `${"•".repeat(phone.length - 4)}${phone.slice(-4)}`;
}

export default async function AdminProfilePage() {
  const { profile } = await requireAdminSession();
  const totpEnrolled = await isTotpEnrolled(profile.userId);

  return (
    <div className="flex max-w-md flex-col gap-8">
      <section>
        <h2 className="font-display text-lg text-charcoal">Account</h2>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-charcoal/60">Email</dt>
            <dd>{profile.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-charcoal/60">Role</dt>
            <dd className="capitalize">{profile.role}</dd>
          </div>
        </dl>

        <form action={updateDisplayName} className="mt-4 flex flex-col gap-2">
          <label htmlFor="displayName" className="text-sm font-medium">
            Display name
          </label>
          <input
            id="displayName"
            name="displayName"
            defaultValue={profile.displayName ?? ""}
            className="rounded border border-silver px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="mt-1 self-start rounded bg-charcoal px-4 py-1.5 text-sm font-medium text-cream transition-colors hover:bg-charcoal/90"
          >
            Save
          </button>
        </form>
      </section>

      <section>
        <h2 className="font-display text-lg text-charcoal">Two-factor authentication</h2>
        <p className="mt-2 text-sm text-charcoal/70">
          Current phone: <span className="font-medium">{maskPhone(profile.phoneE164)}</span>
        </p>

        <form action={sendEnrollmentCode} className="mt-4 flex flex-col gap-2">
          <label htmlFor="phone" className="text-sm font-medium">
            {profile.phoneE164 ? "Change phone number" : "Add a phone number"}
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="+15555550123"
            className="rounded border border-silver px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="mt-1 self-start rounded bg-charcoal px-4 py-1.5 text-sm font-medium text-cream transition-colors hover:bg-charcoal/90"
          >
            Send verification code
          </button>
        </form>
      </section>

      <section>
        <h2 className="font-display text-lg text-charcoal">Authenticator app</h2>
        <p className="mt-2 text-sm text-charcoal/70">
          An independent second option at login — keeps working even if text
          messages are ever unavailable.
        </p>
        <p className="mt-2 text-sm">
          Status:{" "}
          <span className="font-medium">
            {totpEnrolled ? "Enabled" : "Not enabled"}
          </span>
        </p>

        {totpEnrolled ? (
          <form action={disableTotp} className="mt-3">
            <ConfirmSubmitButton
              confirmMessage="Remove your authenticator app? You'll need to set it up again to use it at login."
              className="rounded border border-red-300 px-4 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              Remove authenticator app
            </ConfirmSubmitButton>
          </form>
        ) : (
          <form action={beginTotpEnrollment} className="mt-3">
            <button
              type="submit"
              className="rounded bg-charcoal px-4 py-1.5 text-sm font-medium text-cream transition-colors hover:bg-charcoal/90"
            >
              Set up authenticator app
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
