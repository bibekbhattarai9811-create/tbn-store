import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BookingStatusForm } from "@/components/admin/BookingStatusForm";
import { updateBookingStatusAction } from "../actions";
import { getLocale } from "@/i18n/locale";
import { getDictionary } from "@/i18n/dictionaries";
import { tf } from "@/i18n/format";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: (await getDictionary(locale)).admin.bookings.title };
}

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

  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const b = dict.admin.bookings;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {tf(b.detailTitle, { n: booking.bookingNumber })}
          </h1>
          <p className="text-sm text-foreground/60">
            {tf(b.received, { date: booking.createdAt.toLocaleDateString() })}
          </p>
        </div>
        <BookingStatusForm
          action={updateBookingStatusAction.bind(null, booking.id)}
          currentStatus={booking.status}
          dict={{
            bookingStatus: b.bookingStatus,
            updateStatus: b.updateStatus,
            updating: b.updating,
          }}
          statusDict={dict.bookingStatus}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-3 lg:col-span-2">
          <h2 className="text-lg font-semibold">{b.product}</h2>
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
                {booking.size && `${b.colSize}: ${booking.size} · `}
                {tf(b.quantityRequested, { n: booking.quantity })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold">{b.customerContact}</h2>
          <dl className="flex flex-col gap-2 rounded-2xl border border-border-subtle p-4 text-sm">
            <div className="flex flex-col">
              <dt className="text-foreground/60">{b.fullName}</dt>
              <dd className="font-medium">{booking.fullName}</dd>
            </div>
            <div className="flex flex-col">
              <dt className="text-foreground/60">{b.phone}</dt>
              <dd className="font-medium">{booking.phone}</dd>
            </div>
            {booking.email && (
              <div className="flex flex-col">
                <dt className="text-foreground/60">{b.email}</dt>
                <dd className="font-medium">{booking.email}</dd>
              </div>
            )}
            <div className="flex flex-col">
              <dt className="text-foreground/60">{b.address}</dt>
              <dd className="font-medium">{booking.address}</dd>
            </div>
            {booking.shopName && (
              <div className="flex flex-col">
                <dt className="text-foreground/60">{b.shopName}</dt>
                <dd className="font-medium">{booking.shopName}</dd>
              </div>
            )}
            {booking.user && (
              <div className="flex flex-col border-t border-border-subtle pt-2">
                <dt className="text-foreground/60">{b.account}</dt>
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
