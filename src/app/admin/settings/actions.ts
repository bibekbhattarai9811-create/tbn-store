"use server";

import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/admin";
import { setSiteSettings } from "@/lib/settings";

export type SettingsActionState = { error?: string; success?: boolean } | undefined;

export async function updateSiteSettingsAction(
  _prevState: SettingsActionState,
  formData: FormData
): Promise<SettingsActionState> {
  const session = await requireAdminAction();
  if (!session) return { error: "Unauthorized" };

  const heroImageUrl = formData.get("heroImageUrl");
  const value = typeof heroImageUrl === "string" && heroImageUrl.trim() !== ""
    ? heroImageUrl.trim()
    : null;

  await setSiteSettings({ heroImageUrl: value });

  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { success: true };
}
