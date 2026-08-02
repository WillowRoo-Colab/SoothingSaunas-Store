import { TickerFormFields } from "@/components/admin/TickerFormFields";
import { createTickerAction } from "../actions";

export default function NewScrollingBannerPage() {
  return (
    <div className="max-w-lg">
      <h1 className="font-display text-2xl text-charcoal">New scrolling banner</h1>
      <p className="mt-1 text-sm text-charcoal/70">
        Image dividers can be uploaded after the first save.
      </p>

      <form action={createTickerAction} className="mt-6">
        <TickerFormFields allowImageDivider={false} />
        <button
          type="submit"
          className="mt-6 rounded bg-charcoal px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-charcoal/90"
        >
          Create banner
        </button>
      </form>
    </div>
  );
}
