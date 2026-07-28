import { listImageHistory } from "@/lib/images";
import { uploadImage } from "../actions";
import { ImageHistoryCard } from "@/components/admin/ImageHistoryCard";

const HERO_SLOT = "homepage-hero";

export default async function BannersPage() {
  const history = await listImageHistory(HERO_SLOT);

  return (
    <div>
      <h1 className="font-display text-2xl text-charcoal">Banners</h1>

      <section className="mt-8">
        <h2 className="text-lg font-medium">Homepage Hero Image</h2>
        <p className="mt-1 text-sm text-charcoal/70">
          Uploading a new image replaces the live hero image immediately. The
          previous one is kept below for reuse. Use Delete to permanently
          remove a mistaken or duplicate upload.
        </p>

        <form
          action={uploadImage}
          className="mt-4 flex flex-wrap items-center gap-3"
        >
          <input type="hidden" name="slot" value={HERO_SLOT} />
          <input
            type="file"
            name="file"
            accept="image/*"
            required
            className="text-sm"
          />
          <button
            type="submit"
            className="rounded bg-charcoal px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-charcoal/90"
          >
            Upload &amp; activate
          </button>
        </form>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-medium">History</h2>
        {history.length === 0 ? (
          <p className="mt-2 text-sm text-charcoal/70">
            No images uploaded yet.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {history.map((image) => (
              <ImageHistoryCard key={image.id} image={image} slot={HERO_SLOT} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
