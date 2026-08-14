"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validation";
import { domainCanReceiveEmail } from "@/lib/email-verify";

export type BookingActionState = { error?: string } | undefined;

export async function createBookingAction(
  _prevState: BookingActionState,
  formData: FormData
): Promise<BookingActionState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "Please sign in to book a product." };
  }

  const parsed = bookingSchema.safeParse({
    productId: formData.get("productId"),
    quantity: formData.get("quantity"),
    size: (formData.get("size") as string) || undefined,
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    email: (formData.get("email") as string) || undefined,
    address: formData.get("address"),
    shopName: (formData.get("shopName") as string) || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  if (parsed.data.email) {
    const emailDomainValid = await domainCanReceiveEmail(parsed.data.email);
    if (!emailDomainValid) {
      return { error: "We couldn't verify that email address. Please check for typos." };
    }
  }

  const product = await prisma.product.findUnique({
    where: { id: parsed.data.productId },
    select: { id: true },
  });
  if (!product) {
    return { error: "This product is no longer available." };
  }

  const booking = await prisma.booking.create({
    data: {
      productId: parsed.data.productId,
      quantity: parsed.data.quantity,
      size: parsed.data.size || null,
      fullName: parsed.data.fullName,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      address: parsed.data.address,
      shopName: parsed.data.shopName || null,
      userId: session.user.id,
    },
  });

  redirect(`/bookings/${booking.id}`);
}
