"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  uploadAndActivateImage,
  activateImage,
  deleteImage,
  updateFocalPoint,
} from "@/lib/images";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/store-settings/login");
}

export async function uploadImage(formData: FormData) {
  const slot = String(formData.get("slot") ?? "");
  const file = formData.get("file");

  if (!slot || !(file instanceof File) || file.size === 0) {
    throw new Error("A slot and a non-empty file are required");
  }

  await uploadAndActivateImage(slot, file);
  revalidatePath("/store-settings");
  revalidatePath("/");
}

export async function reapplyImage(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const slot = String(formData.get("slot") ?? "");

  if (!id || !slot) {
    throw new Error("An image id and slot are required");
  }

  await activateImage(id, slot);
  revalidatePath("/store-settings");
  revalidatePath("/");
}

export async function removeImage(formData: FormData) {
  const id = String(formData.get("id") ?? "");

  if (!id) {
    throw new Error("An image id is required");
  }

  await deleteImage(id);
  revalidatePath("/store-settings");
  revalidatePath("/");
}

export async function saveFocalPoint(
  id: string,
  focalX: number,
  focalY: number
) {
  await updateFocalPoint(id, focalX, focalY);
  revalidatePath("/store-settings");
  revalidatePath("/");
}
