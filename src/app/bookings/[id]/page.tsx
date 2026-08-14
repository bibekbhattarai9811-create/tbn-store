import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { buttonClasses } from "@/components/Button";

export const metadata: Metadata = {
  title: "Booking received",
};

export default async function BookingConfirmationPage(
  props: PageProps<"/bookings/[id]">
) {
  const { id } = await props.params;

  const session = await auth();
  if (!session?.user) {
    redirect(`/login?callbackUrl=/bookings/${id}`);
  }

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      product: {
        include: { images: { orderBy: { position: "asc" }, take: 1 } },
      },
    },
  });

  if (!booking) {
    notFound();
  }

  if (booking.userId !== session.user.id && session.user.role !== "ADMIN") {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-16 sm:px-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <CheckCircle2 className="text-accent" size={40} />
        <h1 className="text-2xl font-semibold tracking-tight">
          Booking received
        </h1>
        <p className="text-sm text-foreground/60">
          Thanks, {booking.fullName}. We&apos;ll contact you shortly at{" "}
          {booking.phone} to confirm details.
        </p>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-border-subtle p-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface">
          {booking.product.images[0] && (
            <Image
              src={booking.product.images[0].url}
              alt={booking.product.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          )}
        </div>
        <div className="flex flex-1 flex-col">
          <Link
            href={`/products/${booking.product.slug}`}
            className="font-medium hover:underline"
          >
            {booking.product.name}
          </Link>
          <span className="text-sm text-foreground/60">
            {booking.size && `Size: ${booking.size} · `}Quantity: {booking.quantity}
          </span>
        </div>
      </div>

      <dl className="flex flex-col gap-2 rounded-2xl border border-border-subtle p-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-foreground/60">Booking reference</dt>
          <dd className="font-medium">#{booking.id.slice(-8).toUpperCase()}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-foreground/60">Status</dt>
          <dd className="font-medium">{booking.status}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-foreground/60">Contact number</dt>
          <dd className="font-medium">{booking.phone}</dd>
        </div>
        {booking.email && (
          <div className="flex justify-between gap-4">
            <dt className="text-foreground/60">Email</dt>
            <dd className="font-medium">{booking.email}</dd>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <dt className="text-foreground/60">Address</dt>
          <dd className="text-right font-medium">{booking.address}</dd>
        </div>
        {booking.shopName && (
          <div className="flex justify-between gap-4">
            <dt className="text-foreground/60">Shop name</dt>
            <dd className="font-medium">{booking.shopName}</dd>
          </div>
        )}
      </dl>

      <div className="flex justify-center">
        <Link href="/products" className={buttonClasses("secondary", "md")}>
          Continue browsing
        </Link>
      </div>
    </div>
  );
}
