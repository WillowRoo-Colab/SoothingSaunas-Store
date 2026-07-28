import "server-only";
import { createAdminClient } from "./supabase/admin";
import { requireAdminSession } from "./supabase/auth";

const BUCKET = "site-assets";

export interface SiteImage {
  id: string;
  slot: string;
  publicUrl: string;
  originalFilename: string;
  status: "active" | "sunset";
  uploadedAt: string;
  focalX: number;
  focalY: number;
}

interface SiteImageRow {
  id: string;
  slot: string;
  storage_path: string;
  public_url: string;
  original_filename: string;
  status: "active" | "sunset";
  uploaded_at: string;
  focal_x: number;
  focal_y: number;
}

function toSiteImage(row: SiteImageRow): SiteImage {
  return {
    id: row.id,
    slot: row.slot,
    publicUrl: row.public_url,
    originalFilename: row.original_filename,
    status: row.status,
    uploadedAt: row.uploaded_at,
    focalX: row.focal_x,
    focalY: row.focal_y,
  };
}

// Public read — no admin session required. Used by guest-facing pages.
export async function getActiveImage(slot: string): Promise<SiteImage | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("site_images")
    .select("*")
    .eq("slot", slot)
    .eq("status", "active")
    .order("uploaded_at", { ascending: false })
    .limit(1)
    .maybeSingle<SiteImageRow>();

  if (error) throw error;
  return data ? toSiteImage(data) : null;
}

// Admin-only — full history for a slot, newest first.
export async function listImageHistory(slot: string): Promise<SiteImage[]> {
  await requireAdminSession();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("site_images")
    .select("*")
    .eq("slot", slot)
    .order("uploaded_at", { ascending: false })
    .returns<SiteImageRow[]>();

  if (error) throw error;
  return (data ?? []).map(toSiteImage);
}

// Admin-only — uploads a new file, stores it, and activates it (sunsetting
// whatever was previously active for this slot). Nothing is ever deleted.
export async function uploadAndActivateImage(
  slot: string,
  file: File
): Promise<SiteImage> {
  await requireAdminSession();
  const supabase = createAdminClient();

  const extension = file.name.split(".").pop() ?? "jpg";
  const storagePath = `${slot}/${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file, { contentType: file.type });

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

  const { error: sunsetError } = await supabase
    .from("site_images")
    .update({ status: "sunset" })
    .eq("slot", slot)
    .eq("status", "active");

  if (sunsetError) throw sunsetError;

  const { data, error: insertError } = await supabase
    .from("site_images")
    .insert({
      slot,
      storage_path: storagePath,
      public_url: publicUrl,
      original_filename: file.name,
      status: "active",
    })
    .select()
    .single<SiteImageRow>();

  if (insertError) throw insertError;
  return toSiteImage(data);
}

// Admin-only — permanently removes an image (storage file + row). This is
// distinct from the sunset lifecycle: sunset preserves history for reuse,
// delete is for cleaning up mistaken or duplicate uploads.
export async function deleteImage(id: string): Promise<void> {
  await requireAdminSession();
  const supabase = createAdminClient();

  const { data: row, error: fetchError } = await supabase
    .from("site_images")
    .select("storage_path")
    .eq("id", id)
    .single<Pick<SiteImageRow, "storage_path">>();

  if (fetchError) throw fetchError;

  const { error: storageError } = await supabase.storage
    .from(BUCKET)
    .remove([row.storage_path]);

  // Ignore "object not found" — the row is still worth cleaning up even if
  // the file was already removed some other way.
  if (storageError && !/not.*found/i.test(storageError.message)) {
    throw storageError;
  }

  const { error: deleteError } = await supabase
    .from("site_images")
    .delete()
    .eq("id", id);

  if (deleteError) throw deleteError;
}

// Admin-only — adjusts which part of the image stays visible when it's
// cropped with object-cover in a frame narrower/shorter than its own aspect
// ratio. Stored as a percentage (0-100) from the top-left.
export async function updateFocalPoint(
  id: string,
  focalX: number,
  focalY: number
): Promise<void> {
  await requireAdminSession();

  const clamp = (n: number) => Math.min(100, Math.max(0, Math.round(n)));

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("site_images")
    .update({ focal_x: clamp(focalX), focal_y: clamp(focalY) })
    .eq("id", id);

  if (error) throw error;
}

// Admin-only — reapply a prior image from history as the active one.
export async function activateImage(id: string, slot: string): Promise<void> {
  await requireAdminSession();
  const supabase = createAdminClient();

  const { error: sunsetError } = await supabase
    .from("site_images")
    .update({ status: "sunset" })
    .eq("slot", slot)
    .eq("status", "active");

  if (sunsetError) throw sunsetError;

  const { error: activateError } = await supabase
    .from("site_images")
    .update({ status: "active" })
    .eq("id", id);

  if (activateError) throw activateError;
}
