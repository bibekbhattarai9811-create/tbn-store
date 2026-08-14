import "server-only";
import type { Locale } from "../locale";
import { en } from "./en";
import { ne } from "./ne";
import { prisma } from "@/lib/prisma";
import { setByPath } from "../manifest";

export type Dictionary = typeof en;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  if (locale === "en") return en;

  const overrides = await prisma.translation.findMany();
  if (overrides.length === 0) return ne;

  const merged = JSON.parse(JSON.stringify(ne)) as Dictionary;
  for (const { key, value } of overrides) {
    setByPath(merged as unknown as Record<string, unknown>, key, value);
  }
  return merged;
}
