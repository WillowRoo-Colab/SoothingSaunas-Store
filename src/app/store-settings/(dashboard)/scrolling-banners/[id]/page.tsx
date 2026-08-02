import { notFound } from "next/navigation";
import Image from "next/image";
import { getTicker } from "@/lib/scrollingTickers";
import { getActiveImage } from "@/lib/images";
import { TickerFormFields } from "@/components/admin/TickerFormFields";
import { ScrollingTicker } from "@/components/site/ScrollingTicker";
import { uploadImage } from "@/app/store-settings/(dashboard)/actions";
import { updateTickerAction } from "../actions";

export default async function EditScrollingBannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticker = await getTicker(id);
  if (!ticker) notFound();

  const dividerSlot = `ticker-divider-${id}`;
  const currentDividerImage = await getActiveImage(dividerSlot);
  const boundUpdate = updateTickerAction.bind(null, id);

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-2xl text-charcoal">Edit scrolling banner</h1>

      {ticker.messages.length > 0 ? (
        <div className="mt-4 overflow-hidden rounded border border-silver bg-charcoal py-3">
          <ScrollingTicker ticker={ticker} />
        </div>
      ) : null}

      <form action={boundUpdate} className="mt-6">
        <TickerFormFields ticker={ticker} allowImageDivider />
        <button
          type="submit"
          className="mt-6 rounded bg-charcoal px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-charcoal/90"
        >
          Save changes
        </button>
      </form>

      <section className="mt-8 border-t border-silver pt-6">
        <h2 className="font-display text-lg text-charcoal">Divider image</h2>
        <p className="mt-1 text-sm text-charcoal/70">
          Only used when the divider type above is set to &quot;Image
          icon&quot; and saved.
        </p>

        {currentDividerImage ? (
          <Image
            src={currentDividerImage.publicUrl}
            alt="Current divider icon"
            width={40}
            height={40}
            className="mt-3 h-10 w-10 rounded border border-silver object-contain"
          />
        ) : null}

        <form action={uploadImage} className="mt-3 flex items-center gap-3">
          <input type="hidden" name="slot" value={dividerSlot} />
          <input
            type="file"
            name="file"
            accept="image/*"
            required
            className="text-sm"
          />
          <button
            type="submit"
            className="rounded bg-charcoal px-3 py-1.5 text-sm font-medium text-cream transition-colors hover:bg-charcoal/90"
          >
            Upload
          </button>
        </form>
        <p className="mt-2 text-xs text-charcoal/60">
          After uploading, set &quot;Message divider&quot; above to &quot;Image
          icon&quot; and save changes to activate it.
        </p>
      </section>
    </div>
  );
}
