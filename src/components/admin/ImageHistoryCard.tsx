"use client";

import { useState } from "react";
import Image from "next/image";
import type { SiteImage } from "@/lib/images";
import {
  reapplyImage,
  removeImage,
} from "@/app/store-settings/(dashboard)/actions";
import { ConfirmSubmitButton } from "./ConfirmSubmitButton";
import { FocalPointPicker } from "./FocalPointPicker";

export function ImageHistoryCard({
  image,
  slot,
}: {
  image: SiteImage;
  slot: string;
}) {
  const [showFocalPoint, setShowFocalPoint] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-4/3 overflow-hidden rounded border border-silver bg-silver">
        <Image
          src={image.publicUrl}
          alt={image.originalFilename}
          fill
          sizes="33vw"
          className="object-cover"
          style={{ objectPosition: `${image.focalX}% ${image.focalY}%` }}
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

      <div className="flex gap-2">
        {image.status !== "active" ? (
          <form action={reapplyImage} className="flex-1">
            <input type="hidden" name="id" value={image.id} />
            <input type="hidden" name="slot" value={slot} />
            <button
              type="submit"
              className="w-full rounded border border-charcoal px-3 py-1.5 text-xs font-medium transition-colors hover:bg-charcoal hover:text-cream"
            >
              Reapply
            </button>
          </form>
        ) : null}
        <form action={removeImage} className="flex-1">
          <input type="hidden" name="id" value={image.id} />
          <ConfirmSubmitButton
            confirmMessage={`Permanently delete "${image.originalFilename}"? This can't be undone.`}
            className="w-full rounded border border-red-700 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-700 hover:text-white"
          >
            Delete
          </ConfirmSubmitButton>
        </form>
      </div>

      <button
        type="button"
        onClick={() => setShowFocalPoint((v) => !v)}
        className="text-left text-xs font-medium text-charcoal/70 underline hover:text-charcoal"
      >
        {showFocalPoint ? "Hide focal point" : "Adjust focal point"}
      </button>

      {showFocalPoint ? (
        <FocalPointPicker
          id={image.id}
          imageUrl={image.publicUrl}
          initialFocalX={image.focalX}
          initialFocalY={image.focalY}
        />
      ) : null}
    </div>
  );
}
