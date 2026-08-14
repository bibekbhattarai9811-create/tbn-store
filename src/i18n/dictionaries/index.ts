import "server-only";
import type { Locale } from "../locale";
import { en } from "./en";
import { ne } from "./ne";

export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = { en, ne };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
