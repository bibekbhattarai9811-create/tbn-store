"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export type OrderActionState = { error?: string } | undefined;

const statusSchema = z.enum([
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]);

export async function updateOrderStatusAction(
  orderId: string,
  _prevState: OrderActionState,
  formData: FormData
): Promise<OrderActionState> {
  const session = await requireAdminAction();
  if (!session) return { error: "Unauthorized" };

  const parsed = statusSchema.safeParse(formData.get("status"));
  if (!parsed.success) {
    return { error: "Invalid order status" };
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: parsed.data },
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return undefined;
}
