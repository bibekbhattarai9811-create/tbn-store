export function getSafeCallbackUrl(
  value: FormDataEntryValue | null,
  fallback: string
): string {
  if (typeof value !== "string" || value.length === 0) return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}
