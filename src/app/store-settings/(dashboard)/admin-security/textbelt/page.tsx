import { requireRole } from "@/lib/supabase/auth";
import { getMaskedTextbeltKey, checkTextbeltQuota } from "@/lib/textbelt";
import { saveTextbeltKey } from "./actions";

export default async function TextbeltPage() {
  await requireRole("owner");

  const [maskedKey, quota] = await Promise.all([
    getMaskedTextbeltKey(),
    checkTextbeltQuota(),
  ]);

  return (
    <div className="flex max-w-md flex-col gap-6">
      <section>
        <h2 className="font-display text-lg text-charcoal">Current key</h2>
        <p className="mt-2 text-sm text-charcoal/70">
          {maskedKey ? (
            <span className="font-mono">{maskedKey}</span>
          ) : (
            "No Textbelt API key is configured yet."
          )}
        </p>

        {quota.ok ? (
          <p className="mt-1 text-sm text-charcoal/70">
            <span className="font-medium text-charcoal">
              {quota.quotaRemaining}
            </span>
            {quota.purchasedQuotaTotal !== null
              ? ` of ${quota.purchasedQuotaTotal} messages remaining`
              : " messages remaining"}
            {quota.purchasedQuotaTotal === null ? (
              <span className="block text-xs text-charcoal/50">
                No purchased total has been recorded yet — enter one below to
                see it as a fraction. Textbelt itself only reports what&apos;s
                left, not what you originally bought.
              </span>
            ) : null}
          </p>
        ) : (
          <p className="mt-1 text-sm text-charcoal/60">{quota.error}</p>
        )}
      </section>

      <section>
        <h2 className="font-display text-lg text-charcoal">Update key</h2>
        <form action={saveTextbeltKey} className="mt-3 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="apiKey" className="text-sm font-medium">
              Textbelt API key
            </label>
            <input
              id="apiKey"
              name="apiKey"
              type="text"
              required
              autoComplete="off"
              className="rounded border border-silver px-3 py-2 text-sm font-mono"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="purchasedQuotaTotal" className="text-sm font-medium">
              Purchased total (optional)
            </label>
            <input
              id="purchasedQuotaTotal"
              name="purchasedQuotaTotal"
              type="number"
              min={0}
              placeholder="e.g. 1000"
              className="rounded border border-silver px-3 py-2 text-sm"
            />
            <p className="text-xs text-charcoal/60">
              Record how many messages you bought with this key so the
              remaining count above can show as a fraction.
            </p>
          </div>

          <button
            type="submit"
            className="mt-1 self-start rounded bg-charcoal px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-charcoal/90"
          >
            Save key
          </button>
        </form>
      </section>
    </div>
  );
}
