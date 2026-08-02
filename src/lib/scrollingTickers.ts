import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminSession } from "@/lib/supabase/auth";

export type TickerFontColor = "charcoal" | "cream" | "gold" | "silver";
export type TickerFontFamily = "display" | "sans" | "heading";
export type TickerDividerType = "character" | "image";
export type TickerWidthMode = "full" | "custom";

export interface TickerMessage {
  id: string;
  text: string;
}

export interface ScrollingTicker {
  id: string;
  label: string;
  placementKey: string;
  enabled: boolean;
  messages: TickerMessage[];
  dividerType: TickerDividerType;
  dividerCharacter: string | null;
  dividerImageUrl: string | null;
  scrollSpeedSeconds: number;
  widthMode: TickerWidthMode;
  widthValue: string | null;
  fontColor: TickerFontColor;
  fontFamily: TickerFontFamily;
  fontSizePx: number;
}

interface ScrollingTickerRow {
  id: string;
  label: string;
  placement_key: string;
  enabled: boolean;
  messages: TickerMessage[];
  divider_type: TickerDividerType;
  divider_character: string | null;
  divider_image_url: string | null;
  scroll_speed_seconds: number;
  width_mode: TickerWidthMode;
  width_value: string | null;
  font_color: TickerFontColor;
  font_family: TickerFontFamily;
  font_size_px: number;
}

const COLUMNS =
  "id, label, placement_key, enabled, messages, divider_type, divider_character, divider_image_url, scroll_speed_seconds, width_mode, width_value, font_color, font_family, font_size_px";

function toTicker(row: ScrollingTickerRow): ScrollingTicker {
  return {
    id: row.id,
    label: row.label,
    placementKey: row.placement_key,
    enabled: row.enabled,
    messages: Array.isArray(row.messages) ? row.messages : [],
    dividerType: row.divider_type,
    dividerCharacter: row.divider_character,
    dividerImageUrl: row.divider_image_url,
    scrollSpeedSeconds: row.scroll_speed_seconds,
    widthMode: row.width_mode,
    widthValue: row.width_value,
    fontColor: row.font_color,
    fontFamily: row.font_family,
    fontSizePx: row.font_size_px,
  };
}

// Public read — no admin session required. Used by guest-facing pages,
// including the shared storefront layout (so it runs on every page, even
// otherwise-fully-static ones like /about). A decorative banner is never
// worth failing an unrelated page's build/render over, so this fails soft
// (log + hide the ticker) rather than throwing — unlike the admin-only
// reads/writes below, which should keep surfacing errors loudly.
export async function getTickerByPlacement(
  placementKey: string
): Promise<ScrollingTicker | null> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("scrolling_tickers")
      .select(COLUMNS)
      .eq("placement_key", placementKey)
      .eq("enabled", true)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle<ScrollingTickerRow>();

    if (error) throw error;
    return data ? toTicker(data) : null;
  } catch (error) {
    console.error(`getTickerByPlacement("${placementKey}") failed:`, error);
    return null;
  }
}

// Admin-only — every instance, for the "Scrolling Banners" list screen.
export async function listTickers(): Promise<ScrollingTicker[]> {
  await requireAdminSession();

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("scrolling_tickers")
    .select(COLUMNS)
    .order("label")
    .returns<ScrollingTickerRow[]>();

  if (error) throw error;
  return (data ?? []).map(toTicker);
}

export async function getTicker(id: string): Promise<ScrollingTicker | null> {
  await requireAdminSession();

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("scrolling_tickers")
    .select(COLUMNS)
    .eq("id", id)
    .maybeSingle<ScrollingTickerRow>();

  if (error) throw error;
  return data ? toTicker(data) : null;
}

export interface TickerInput {
  label: string;
  placementKey: string;
  enabled: boolean;
  messages: TickerMessage[];
  dividerType: TickerDividerType;
  dividerCharacter: string | null;
  dividerImageUrl: string | null;
  scrollSpeedSeconds: number;
  widthMode: TickerWidthMode;
  widthValue: string | null;
  fontColor: TickerFontColor;
  fontFamily: TickerFontFamily;
  fontSizePx: number;
}

export async function createTicker(input: TickerInput): Promise<ScrollingTicker> {
  const { user } = await requireAdminSession();

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("scrolling_tickers")
    .insert({
      label: input.label,
      placement_key: input.placementKey,
      enabled: input.enabled,
      messages: input.messages,
      divider_type: input.dividerType,
      divider_character: input.dividerCharacter,
      divider_image_url: input.dividerImageUrl,
      scroll_speed_seconds: input.scrollSpeedSeconds,
      width_mode: input.widthMode,
      width_value: input.widthValue,
      font_color: input.fontColor,
      font_family: input.fontFamily,
      font_size_px: input.fontSizePx,
      updated_by: user.id,
    })
    .select(COLUMNS)
    .single<ScrollingTickerRow>();

  if (error) throw error;
  return toTicker(data);
}

export async function updateTicker(id: string, input: TickerInput): Promise<void> {
  const { user } = await requireAdminSession();

  const admin = createAdminClient();
  const { error } = await admin
    .from("scrolling_tickers")
    .update({
      label: input.label,
      placement_key: input.placementKey,
      enabled: input.enabled,
      messages: input.messages,
      divider_type: input.dividerType,
      divider_character: input.dividerCharacter,
      divider_image_url: input.dividerImageUrl,
      scroll_speed_seconds: input.scrollSpeedSeconds,
      width_mode: input.widthMode,
      width_value: input.widthValue,
      font_color: input.fontColor,
      font_family: input.fontFamily,
      font_size_px: input.fontSizePx,
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    })
    .eq("id", id);

  if (error) throw error;
}

export async function deleteTicker(id: string): Promise<void> {
  await requireAdminSession();

  const admin = createAdminClient();
  const { error } = await admin.from("scrolling_tickers").delete().eq("id", id);
  if (error) throw error;
}
