"use client";

import { useRef, useState, useTransition } from "react";
import { saveFocalPoint } from "@/app/store-settings/(dashboard)/actions";

export function FocalPointPicker({
  id,
  imageUrl,
  initialFocalX,
  initialFocalY,
}: {
  id: string;
  imageUrl: string;
  initialFocalX: number;
  initialFocalY: number;
}) {
  const [focalX, setFocalX] = useState(initialFocalX);
  const [focalY, setFocalY] = useState(initialFocalY);
  const [saved, setSaved] = useState(true);
  const [isPending, startTransition] = useTransition();
  const frameRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  function setFromPointer(clientX: number, clientY: number) {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    setFocalX(Math.min(100, Math.max(0, Math.round(x))));
    setFocalY(Math.min(100, Math.max(0, Math.round(y))));
    setSaved(false);
  }

  function handleSave() {
    startTransition(async () => {
      await saveFocalPoint(id, focalX, focalY);
      setSaved(true);
    });
  }

  return (
    <div className="flex flex-col gap-3 rounded border border-silver p-3">
      <p className="text-xs text-charcoal/70">
        Drag the crosshair to choose what stays visible when this image is
        cropped, or enter exact percentages.
      </p>

      <div
        ref={frameRef}
        className="relative aspect-[3/1] w-full cursor-crosshair overflow-hidden rounded bg-charcoal"
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          setFromPointer(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          if (dragging.current) setFromPointer(e.clientX, e.clientY);
        }}
        onPointerUp={() => {
          dragging.current = false;
        }}
      >
        {/* Plain img, not next/image — this is an admin-only tool, not a
            guest-facing route, so SSES-012 image budgets don't apply. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt=""
          className="h-full w-full object-cover"
          style={{ objectPosition: `${focalX}% ${focalY}%` }}
          draggable={false}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold bg-charcoal/50"
          style={{ left: `${focalX}%`, top: `${focalY}%` }}
        />
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-xs">
          X %
          <input
            type="number"
            min={0}
            max={100}
            value={focalX}
            onChange={(e) => {
              setFocalX(Math.min(100, Math.max(0, Number(e.target.value))));
              setSaved(false);
            }}
            className="w-16 rounded border border-silver px-2 py-1"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs">
          Y %
          <input
            type="number"
            min={0}
            max={100}
            value={focalY}
            onChange={(e) => {
              setFocalY(Math.min(100, Math.max(0, Number(e.target.value))));
              setSaved(false);
            }}
            className="w-16 rounded border border-silver px-2 py-1"
          />
        </label>
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending || saved}
          className="rounded bg-charcoal px-3 py-1.5 text-xs font-medium text-cream transition-colors hover:bg-charcoal/90 disabled:opacity-50"
        >
          {isPending ? "Saving…" : saved ? "Saved" : "Save focal point"}
        </button>
      </div>
    </div>
  );
}
