import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export async function requireAdminPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/");
  }
  return session;
}

export async function requireAdminAction() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return null;
  }
  return session;
}
