import "server-only";
import { en } from "./dictionaries/en";

export type TranslationEntry = { path: string; en: string; section: string };

type StringTree = { [key: string]: string | StringTree };

function walk(obj: StringTree, prefix: string, out: TranslationEntry[]) {
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      const parts = path.split(".");
      const section = parts[0] === "admin" ? parts.slice(0, 2).join(".") : parts[0];
      out.push({ path, en: value, section });
    } else {
      walk(value, path, out);
    }
  }
}

let cachedManifest: TranslationEntry[] | null = null;

export function getTranslationManifest(): TranslationEntry[] {
  if (!cachedManifest) {
    const out: TranslationEntry[] = [];
    walk(en as unknown as StringTree, "", out);
    cachedManifest = out;
  }
  return cachedManifest;
}

export const SECTION_LABELS: Record<string, string> = {
  common: "Common",
  nav: "Navigation",
  footer: "Footer",
  home: "Homepage",
  products: "Product listing",
  product: "Product detail",
  reviews: "Reviews",
  booking: "Booking form",
  bookingStatus: "Booking status labels",
  wishlist: "Wishlist page",
  auth: "Sign in / register",
  account: "Account page",
  contact: "Contact page",
  about: "About page",
  shipping: "Shipping & returns page",
  notFound: "404 page",
  "admin.nav": "Admin: sidebar",
  "admin.dashboard": "Admin: dashboard",
  "admin.products": "Admin: products",
  "admin.categories": "Admin: categories",
  "admin.bookings": "Admin: bookings",
  "admin.customers": "Admin: customers",
  "admin.reviews": "Admin: reviews",
  "admin.settings": "Admin: settings",
  "admin.translations": "Admin: translations page",
  "admin.role": "Admin: role labels",
};

export function getByPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function setByPath(obj: Record<string, unknown>, path: string, value: string): void {
  const keys = path.split(".");
  const last = keys.pop();
  if (!last) return;
  let target: Record<string, unknown> = obj;
  for (const key of keys) {
    target = target[key] as Record<string, unknown>;
  }
  target[last] = value;
}
