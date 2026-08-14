import "server-only";
import type { Locale } from "../locale";
import { en } from "./en";
import { ne } from "./ne";
import { prisma } from "@/lib/prisma";
import { setByPath } from "../manifest";

export type Dictionary = typeof en;

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ]);
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  if (locale === "en") return en;

  let overrides: { key: string; value: string }[] = [];
  try {
    overrides = await withTimeout(prisma.translation.findMany(), 2000);
  } catch (error) {
    console.error("Failed to load translation overrides, using defaults", error);
    return ne;
  }

  if (overrides.length === 0) return ne;

  const merged = JSON.parse(JSON.stringify(ne)) as Dictionary;
  for (const { key, value } of overrides) {
    setByPath(merged as unknown as Record<string, unknown>, key, value);
  }
  return merged;
}
