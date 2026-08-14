"use server";

import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/i18n/locale";
import { getDictionary } from "@/i18n/dictionaries";

const ROLES = ["CUSTOMER", "HELPER", "ADMIN"] as const;
type UserRole = (typeof ROLES)[number];

export async function updateUserRoleAction(
  userId: string,
  role: string
): Promise<{ error?: string }> {
  const session = await requireAdminAction();
  if (!session) return { error: "Unauthorized" };

  if (!ROLES.includes(role as UserRole)) {
    return { error: "Invalid role" };
  }

  const locale = await getLocale();
  const dict = await getDictionary(locale);

  if (session.user.id === userId) {
    return { error: dict.admin.customers.cannotChangeOwnRole };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: role as UserRole },
  });

  revalidatePath(`/admin/customers/${userId}`);
  revalidatePath("/admin/customers");
  return {};
}
