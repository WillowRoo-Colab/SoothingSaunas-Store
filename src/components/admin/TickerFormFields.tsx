"use client";

import { useState } from "react";
import type { ScrollingTicker } from "@/lib/scrollingTickers";
import { TickerMessagesField } from "./TickerMessagesField";

const FONT_COLORS = ["charcoal", "cream", "gold", "silver"] as const;
const FONT_FAMILIES: Array<{ value: "display" | "sans" | "heading"; label: string }> = [
  { value: "sans", label: "Lato (body)" },
  { value: "display", label: "Cormorant Upright (display)" },
  { value: "heading", label: "Playfair Display (heading)" },
];

export function TickerFormFields({
  ticker,
  allowImageDivider,
}: {
  ticker?: ScrollingTicker;
  /** Image dividers are uploaded to a per-ticker slot, so only available
   * once the ticker exists (i.e. on the edit form, not "new"). */
  allowImageDivider: boolean;
}) {
  const [dividerType, setDividerType] = useState<"character" | "image">(
    ticker?.dividerType ?? "character"
  );
  const [widthMode, setWidthMode] = useState<"full" | "custom">(ticker?.widthMode ?? "full");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <label htmlFor="label" className="text-sm font-medium">
          Label
        </label>
        <input
          id="label"
          name="label"
          defaultValue={ticker?.label}
          required
          placeholder="e.g. Homepage Top"
          className="rounded border border-silver px-3 py-2 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="placementKey" className="text-sm font-medium">
          Placement key
        </label>
        <input
          id="placementKey"
          name="placementKey"
          defaultValue={ticker?.placementKey}
          required
          placeholder="e.g. homepage-top"
          className="rounded border border-silver px-3 py-2 font-mono text-sm"
        />
        <p className="text-xs text-charcoal/60">
          Known keys in use today: <code>homepage-top</code>,{" "}
          <code>product-page-sidebar</code>, <code>collection-above-grid</code>.
          Only one enabled banner per key is shown (the most recently updated).
        </p>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" name="enabled" defaultChecked={ticker?.enabled ?? true} />
        Enabled
      </label>

      <TickerMessagesField initialMessages={ticker?.messages ?? []} />

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium">Message divider</legend>
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-1.5">
            <input
              type="radio"
              name="dividerType"
              value="character"
              checked={dividerType === "character"}
              onChange={() => setDividerType("character")}
            />
            Character
          </label>
          <label className="flex items-center gap-1.5">
            <input
              type="radio"
              name="dividerType"
              value="image"
              checked={dividerType === "image"}
              onChange={() => setDividerType("image")}
              disabled={!allowImageDivider}
            />
            Image icon {allowImageDivider ? "" : "(save once, then upload below)"}
          </label>
        </div>
        {dividerType === "character" ? (
          <input
            name="dividerCharacter"
            defaultValue={ticker?.dividerCharacter ?? "•"}
            maxLength={4}
            className="w-24 rounded border border-silver px-3 py-2 text-center text-sm"
          />
        ) : null}
      </fieldset>

      <div className="flex flex-col gap-1">
        <label htmlFor="scrollSpeedSeconds" className="text-sm font-medium">
          Scroll speed (seconds per loop)
        </label>
        <input
          id="scrollSpeedSeconds"
          name="scrollSpeedSeconds"
          type="number"
          min={4}
          max={120}
          step={1}
          defaultValue={ticker?.scrollSpeedSeconds ?? 20}
          className="w-28 rounded border border-silver px-3 py-2 text-sm"
        />
        <p className="text-xs text-charcoal/60">Lower is faster.</p>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium">Width</legend>
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-1.5">
            <input
              type="radio"
              name="widthMode"
              value="full"
              checked={widthMode === "full"}
              onChange={() => setWidthMode("full")}
            />
            Full width of container
          </label>
          <label className="flex items-center gap-1.5">
            <input
              type="radio"
              name="widthMode"
              value="custom"
              checked={widthMode === "custom"}
              onChange={() => setWidthMode("custom")}
            />
            Custom
          </label>
        </div>
        {widthMode === "custom" ? (
          <input
            name="widthValue"
            defaultValue={ticker?.widthValue ?? ""}
            placeholder="e.g. 320px or 60%"
            className="w-40 rounded border border-silver px-3 py-2 text-sm"
          />
        ) : null}
      </fieldset>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="fontColor" className="text-sm font-medium">
            Font color
          </label>
          <select
            id="fontColor"
            name="fontColor"
            defaultValue={ticker?.fontColor ?? "cream"}
            className="rounded border border-silver px-2 py-2 text-sm capitalize"
          >
            {FONT_COLORS.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="fontFamily" className="text-sm font-medium">
            Font style
          </label>
          <select
            id="fontFamily"
            name="fontFamily"
            defaultValue={ticker?.fontFamily ?? "sans"}
            className="rounded border border-silver px-2 py-2 text-sm"
          >
            {FONT_FAMILIES.map((family) => (
              <option key={family.value} value={family.value}>
                {family.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="fontSizePx" className="text-sm font-medium">
            Font size (px)
          </label>
          <input
            id="fontSizePx"
            name="fontSizePx"
            type="number"
            min={10}
            max={32}
            defaultValue={ticker?.fontSizePx ?? 14}
            className="rounded border border-silver px-2 py-2 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
