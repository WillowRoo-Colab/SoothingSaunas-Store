"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createTicker,
  updateTicker,
  deleteTicker,
  type TickerInput,
  type TickerMessage,
  type TickerFontColor,
  type TickerFontFamily,
  type TickerDividerType,
  type TickerWidthMode,
} from "@/lib/scrollingTickers";
import { getActiveImage } from "@/lib/images";

function parseInput(formData: FormData): TickerInput {
  const messagesJson = String(formData.get("messagesJson") ?? "[]");
  let messages: TickerMessage[] = [];
  try {
    const parsed = JSON.parse(messagesJson);
    if (Array.isArray(parsed)) {
      messages = parsed
        .filter(
          (m): m is TickerMessage =>
            typeof m?.id === "string" && typeof m?.text === "string" && m.text.trim() !== ""
        )
        .map((m) => ({ id: m.id, text: m.text.trim() }));
    }
  } catch {
    messages = [];
  }

  const dividerType = String(formData.get("dividerType") ?? "character") as TickerDividerType;
  const widthMode = String(formData.get("widthMode") ?? "full") as TickerWidthMode;
  const scrollSpeedSeconds = Number(formData.get("scrollSpeedSeconds") ?? 20);
  const fontSizePx = Number(formData.get("fontSizePx") ?? 14);

  return {
    label: String(formData.get("label") ?? "").trim(),
    placementKey: String(formData.get("placementKey") ?? "").trim(),
    enabled: formData.get("enabled") === "on",
    messages,
    dividerType,
    dividerCharacter:
      dividerType === "character" ? String(formData.get("dividerCharacter") ?? "•") : null,
    dividerImageUrl: null, // resolved below for image dividers on existing tickers
    scrollSpeedSeconds: Number.isFinite(scrollSpeedSeconds) ? scrollSpeedSeconds : 20,
    widthMode,
    widthValue: widthMode === "custom" ? String(formData.get("widthValue") ?? "").trim() : null,
    fontColor: String(formData.get("fontColor") ?? "cream") as TickerFontColor,
    fontFamily: String(formData.get("fontFamily") ?? "sans") as TickerFontFamily,
    fontSizePx: Number.isFinite(fontSizePx) ? Math.min(32, Math.max(10, fontSizePx)) : 14,
  };
}

export async function createTickerAction(formData: FormData) {
  const input = parseInput(formData);

  if (!input.label || !input.placementKey) {
    throw new Error("Label and placement key are required");
  }

  const ticker = await createTicker(input);

  revalidatePath("/store-settings/scrolling-banners");
  redirect(`/store-settings/scrolling-banners/${ticker.id}`);
}

export async function updateTickerAction(id: string, formData: FormData) {
  const input = parseInput(formData);

  if (!input.label || !input.placementKey) {
    throw new Error("Label and placement key are required");
  }

  // Image dividers are uploaded separately (reusing the existing
  // site_images slot system) — pick up whatever is currently active for
  // this ticker's slot rather than trusting a client-submitted URL.
  if (input.dividerType === "image") {
    const activeImage = await getActiveImage(`ticker-divider-${id}`);
    input.dividerImageUrl = activeImage?.publicUrl ?? null;
  }

  await updateTicker(id, input);

  revalidatePath("/store-settings/scrolling-banners");
  revalidatePath(`/store-settings/scrolling-banners/${id}`);
  revalidatePath("/");
}

export async function deleteTickerAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("A ticker id is required");

  await deleteTicker(id);

  revalidatePath("/store-settings/scrolling-banners");
  revalidatePath("/");
}
