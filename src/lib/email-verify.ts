import "server-only";
import { resolve4, resolve6, resolveMx } from "dns/promises";

const NO_SUCH_DOMAIN_CODES = new Set(["ENOTFOUND", "ENODATA"]);

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ]);
}

/**
 * Returns "yes" (records found), "no" (resolver definitively said no such
 * domain/records), or "unknown" (network/resolver failure — can't tell).
 */
async function lookup<T>(fn: () => Promise<T[]>): Promise<"yes" | "no" | "unknown"> {
  try {
    const records = await withTimeout(fn(), 3000);
    return records.length > 0 ? "yes" : "no";
  } catch (error) {
    if (error instanceof Error && error.message === "timeout") return "unknown";
    const code = (error as NodeJS.ErrnoException).code;
    if (code && NO_SUCH_DOMAIN_CODES.has(code)) return "no";
    return "unknown";
  }
}

/**
 * Checks whether an email's domain has mail servers configured (MX, or an
 * A/AAAA fallback per RFC 5321). Catches typos and made-up domains that
 * pass format validation but can never receive mail. Only rejects on a
 * definitive "no such domain/records" answer from the resolver — any
 * network/timeout failure is treated as unverifiable and allowed through,
 * so a flaky or unreachable DNS resolver never blocks a real signup.
 */
export async function domainCanReceiveEmail(email: string): Promise<boolean> {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;

  const mx = await lookup(() => resolveMx(domain));
  if (mx === "yes") return true;
  if (mx === "unknown") return true;

  const a = await lookup(() => resolve4(domain));
  if (a === "yes") return true;
  if (a === "unknown") return true;

  const aaaa = await lookup(() => resolve6(domain));
  if (aaaa === "yes") return true;
  if (aaaa === "unknown") return true;

  // All three lookups came back with a definitive "no records" answer.
  return false;
}
