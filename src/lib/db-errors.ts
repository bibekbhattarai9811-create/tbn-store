import "server-only";
import { Prisma } from "@/generated/prisma/client";

/**
 * Prisma 7's driver-adapter architecture wraps raw Postgres constraint
 * errors under P2039 (not the classic P2003 foreign-key code), so we
 * check the underlying message too rather than relying on a single code.
 */
export function isForeignKeyRestrictError(error: unknown): boolean {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return false;
  if (error.code === "P2003") return true;
  if (error.code === "P2039") {
    const message = error.message.toLowerCase();
    return message.includes("foreign key") || message.includes("violates");
  }
  return false;
}
