import Image from "next/image";
import { listImageHistory } from "@/lib/images";
import { signOut, uploadImage, reapplyImage } from "./actions";

const HERO_SLOT = "homepage-hero";

export default async function StoreSettingsPage() {
  const history = await listImageHistory(HERO_SLOT);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-charcoal">
          Store Settings
        </h1>
        <form action={signOut}>
          <button
            type="submit"
            className="text-sm text-charcoal/70 underline hover:text-charcoal"
          >
            Sign out
          </button>
        </form>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-medium">Homepage Hero Image</h2>
        <p className="mt-1 text-sm text-charcoal/70">
          Uploading a new image replaces the live hero image immediately. The
          previous one is kept below for reuse — nothing is deleted.
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
              <div key={image.id} className="flex flex-col gap-2">
                <div className="relative aspect-4/3 overflow-hidden rounded border border-silver bg-silver">
                  <Image
                    src={image.publicUrl}
                    alt={image.originalFilename}
                    fill
                    sizes="33vw"
                    className="object-cover"
                  />
                  {image.status === "active" ? (
                    <span className="absolute left-2 top-2 rounded bg-gold px-2 py-0.5 text-xs font-medium text-charcoal">
                      Active
                    </span>
                  ) : null}
                </div>
                <p className="truncate text-xs text-charcoal/70">
                  {image.originalFilename}
                </p>
                {image.status !== "active" ? (
                  <form action={reapplyImage}>
                    <input type="hidden" name="id" value={image.id} />
                    <input type="hidden" name="slot" value={HERO_SLOT} />
                    <button
                      type="submit"
                      className="w-full rounded border border-charcoal px-3 py-1.5 text-xs font-medium transition-colors hover:bg-charcoal hover:text-cream"
                    >
                      Reapply
                    </button>
                  </form>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
