import "server-only";
import { prisma } from "@/lib/prisma";

const SETTINGS_ID = "singleton";

export async function getSiteSettings() {
  return prisma.siteSettings.findUnique({ where: { id: SETTINGS_ID } });
}

export async function setSiteSettings(data: { heroImageUrl: string | null }) {
  return prisma.siteSettings.upsert({
    where: { id: SETTINGS_ID },
    update: data,
    create: { id: SETTINGS_ID, ...data },
  });
}
