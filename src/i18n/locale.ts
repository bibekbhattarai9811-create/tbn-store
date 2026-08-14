import "server-only";
import { cookies } from "next/headers";

export type Locale = "en" | "ne";

export const LOCALE_COOKIE = "locale";
export const DEFAULT_LOCALE: Locale = "ne";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return value === "en" || value === "ne" ? value : DEFAULT_LOCALE;
}
