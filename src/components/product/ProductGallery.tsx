"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { ProductDetailMedia } from "@/lib/shopify/products";
import { ZoomModal } from "./ZoomModal";

export function ProductGallery({
  media,
  productTitle,
}: {
  media: ProductDetailMedia[];
  productTitle: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const thumbsRef = useRef<HTMLDivElement>(null);

  const active = media[activeIndex];

  function scrollThumbs(direction: 1 | -1) {
    thumbsRef.current?.scrollBy({ left: direction * 200, behavior: "smooth" });
  }

  if (!active) return null;

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={0}
        aria-label="Open zoomed image"
        onClick={() => setZoomOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setZoomOpen(true);
        }}
        className="relative mx-auto aspect-4/3 w-full max-w-[560px] cursor-zoom-in overflow-hidden rounded-2xl bg-charcoal-900 sm:max-w-none"
      >
        <Image
          src={active.url}
          alt={active.alt ?? productTitle}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-contain transition-transform duration-300 hover:scale-[1.015]"
          priority
        />
      </div>

      {media.length > 1 ? (
        <div className="relative mx-auto mt-3 w-full max-w-[560px] sm:max-w-none">
          {media.length > 4 ? (
            <button
              type="button"
              onClick={() => scrollThumbs(-1)}
              aria-label="Scroll thumbnails left"
              className="absolute left-0 top-1/2 z-10 -translate-x-3 -translate-y-1/2 rounded-full bg-charcoal/70 p-2 text-gold transition hover:bg-charcoal"
            >
              &#10094;
            </button>
          ) : null}

          <div
            ref={thumbsRef}
            className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-smooth p-2"
          >
            {media.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`relative h-[70px] w-[90px] shrink-0 snap-start overflow-hidden rounded-[10px] transition-transform hover:scale-105 ${
                  index === activeIndex
                    ? "shadow-[0_0_0_3px_var(--color-gold),0_0_8px_rgba(201,168,106,0.4)]"
                    : ""
                }`}
              >
                <Image
                  src={item.url}
                  alt=""
                  fill
                  sizes="90px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          {media.length > 4 ? (
            <button
              type="button"
              onClick={() => scrollThumbs(1)}
              aria-label="Scroll thumbnails right"
              className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-3 rounded-full bg-charcoal/70 p-2 text-gold transition hover:bg-charcoal"
            >
              &#10095;
            </button>
          ) : null}
        </div>
      ) : null}

      {zoomOpen ? (
        <ZoomModal
          src={active.url}
          alt={active.alt ?? productTitle}
          onClose={() => setZoomOpen(false)}
        />
      ) : null}
    </div>
  );
}
