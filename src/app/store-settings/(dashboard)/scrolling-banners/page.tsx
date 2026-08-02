import Link from "next/link";
import { listTickers } from "@/lib/scrollingTickers";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { deleteTickerAction } from "./actions";

export default async function ScrollingBannersPage() {
  const tickers = await listTickers();

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-charcoal">Scrolling Banners</h1>
        <Link
          href="/store-settings/scrolling-banners/new"
          className="rounded bg-charcoal px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-charcoal/90"
        >
          + New banner
        </Link>
      </div>
      <p className="mt-1 text-sm text-charcoal/70">
        Each banner is a separate, independently placed instance — e.g. one
        for the homepage top, one for product pages, one for collection
        pages — each with its own messages, speed, and width.
      </p>

      <table className="mt-6 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-silver text-charcoal/60">
            <th className="py-2 pr-4 font-medium">Label</th>
            <th className="py-2 pr-4 font-medium">Placement key</th>
            <th className="py-2 pr-4 font-medium">Messages</th>
            <th className="py-2 pr-4 font-medium">Status</th>
            <th className="py-2 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickers.map((ticker) => (
            <tr key={ticker.id} className="border-b border-silver/60">
              <td className="py-2 pr-4">{ticker.label}</td>
              <td className="py-2 pr-4 font-mono text-xs">{ticker.placementKey}</td>
              <td className="py-2 pr-4">{ticker.messages.length}</td>
              <td className="py-2 pr-4">{ticker.enabled ? "Enabled" : "Disabled"}</td>
              <td className="py-2">
                <div className="flex items-center gap-3">
                  <Link
                    href={`/store-settings/scrolling-banners/${ticker.id}`}
                    className="text-xs font-medium text-charcoal/70 underline hover:text-charcoal"
                  >
                    Edit
                  </Link>
                  <form action={deleteTickerAction}>
                    <input type="hidden" name="id" value={ticker.id} />
                    <ConfirmSubmitButton
                      confirmMessage={`Delete "${ticker.label}"? This can't be undone.`}
                      className="text-xs font-medium text-red-600 underline hover:text-red-700"
                    >
                      Delete
                    </ConfirmSubmitButton>
                  </form>
                </div>
              </td>
            </tr>
          ))}
          {tickers.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-6 text-center text-charcoal/50">
                No scrolling banners yet.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
