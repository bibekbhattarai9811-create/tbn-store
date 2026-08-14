"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { LOCALE_COOKIE, type Locale } from "./locale";
import { requireAdminAction } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function setLocaleAction(locale: Locale): Promise<void> {
  const store = await cookies();
  store.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}

export async function updateTranslationAction(
  key: string,
  value: string
): Promise<{ error?: string }> {
  const session = await requireAdminAction();
  if (!session) return { error: "Unauthorized" };

  const trimmed = value.trim();
  if (!trimmed) {
    await prisma.translation.deleteMany({ where: { key } });
  } else {
    await prisma.translation.upsert({
      where: { key },
      create: { key, value: trimmed },
      update: { value: trimmed },
    });
  }

  revalidatePath("/", "layout");
  return {};
}

export async function resetTranslationAction(key: string): Promise<{ error?: string }> {
  const session = await requireAdminAction();
  if (!session) return { error: "Unauthorized" };

  await prisma.translation.deleteMany({ where: { key } });
  revalidatePath("/", "layout");
  return {};
}
