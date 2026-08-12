"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export type BookingActionState = { error?: string } | undefined;

const statusSchema = z.enum(["PENDING", "CONTACTED", "CONFIRMED", "CANCELLED"]);

export async function updateBookingStatusAction(
  bookingId: string,
  _prevState: BookingActionState,
  formData: FormData
): Promise<BookingActionState> {
  const session = await requireAdminAction();
  if (!session) return { error: "Unauthorized" };

  const parsed = statusSchema.safeParse(formData.get("status"));
  if (!parsed.success) {
    return { error: "Invalid booking status" };
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: parsed.data },
  });

  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${bookingId}`);
  return undefined;
}
