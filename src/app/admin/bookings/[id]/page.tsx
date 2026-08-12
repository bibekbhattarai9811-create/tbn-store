import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BookingStatusForm } from "@/components/admin/BookingStatusForm";
import { updateBookingStatusAction } from "../actions";

export const metadata: Metadata = {
  title: "Booking detail",
};

export default async function AdminBookingDetailPage(
  props: PageProps<"/admin/bookings/[id]">
) {
  const { id } = await props.params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      product: {
        include: { images: { orderBy: { position: "asc" }, take: 1 } },
      },
      user: { select: { id: true, name: true, email: true } },
    },
  });

  if (!booking) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Booking #{booking.id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-sm text-foreground/60">
            Received {booking.createdAt.toLocaleDateString()}
          </p>
        </div>
        <BookingStatusForm
          action={updateBookingStatusAction.bind(null, booking.id)}
          currentStatus={booking.status}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-3 lg:col-span-2">
          <h2 className="text-lg font-semibold">Product</h2>
          <div className="flex items-center gap-4 rounded-2xl border border-border-subtle p-4">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-surface">
              {booking.product.images[0] && (
                <Image
                  src={booking.product.images[0].url}
                  alt={booking.product.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex flex-1 flex-col">
              <Link
                href={`/admin/products/${booking.productId}`}
                className="font-medium hover:underline"
              >
                {booking.product.name}
              </Link>
              <span className="text-xs text-foreground/50">
                Quantity requested: {booking.quantity}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold">Customer contact</h2>
          <dl className="flex flex-col gap-2 rounded-2xl border border-border-subtle p-4 text-sm">
            <div className="flex flex-col">
              <dt className="text-foreground/60">Full name</dt>
              <dd className="font-medium">{booking.fullName}</dd>
            </div>
            <div className="flex flex-col">
              <dt className="text-foreground/60">Phone</dt>
              <dd className="font-medium">{booking.phone}</dd>
            </div>
            {booking.email && (
              <div className="flex flex-col">
                <dt className="text-foreground/60">Email</dt>
                <dd className="font-medium">{booking.email}</dd>
              </div>
            )}
            <div className="flex flex-col">
              <dt className="text-foreground/60">Address</dt>
              <dd className="font-medium">{booking.address}</dd>
            </div>
            {booking.shopName && (
              <div className="flex flex-col">
                <dt className="text-foreground/60">Shop name</dt>
                <dd className="font-medium">{booking.shopName}</dd>
              </div>
            )}
            {booking.user && (
              <div className="flex flex-col border-t border-border-subtle pt-2">
                <dt className="text-foreground/60">Account</dt>
                <dd>
                  <Link
                    href={`/admin/customers/${booking.user.id}`}
                    className="font-medium hover:underline"
                  >
                    {booking.user.name}
                  </Link>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}
