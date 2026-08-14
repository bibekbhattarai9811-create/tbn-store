import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { buttonClasses } from "@/components/Button";
import { getLocale } from "@/i18n/locale";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: getDictionary(locale).booking.received };
}

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

  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-16 sm:px-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <CheckCircle2 className="text-accent" size={40} />
        <h1 className="text-2xl font-semibold tracking-tight">{dict.booking.received}</h1>
        <p className="text-sm text-foreground/60">
          {dict.booking.thanks(booking.fullName, booking.phone)}
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
            {booking.size && `${dict.booking.size}: ${booking.size} · `}
            {dict.booking.quantityLabel}: {booking.quantity}
          </span>
        </div>
      </div>

      <dl className="flex flex-col gap-2 rounded-2xl border border-border-subtle p-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-foreground/60">{dict.booking.bookingNumber}</dt>
          <dd className="font-medium">#{booking.bookingNumber}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-foreground/60">{dict.booking.status}</dt>
          <dd className="font-medium">{dict.bookingStatus[booking.status]}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-foreground/60">{dict.booking.contactNumber}</dt>
          <dd className="font-medium">{booking.phone}</dd>
        </div>
        {booking.email && (
          <div className="flex justify-between gap-4">
            <dt className="text-foreground/60">{dict.booking.email}</dt>
            <dd className="font-medium">{booking.email}</dd>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <dt className="text-foreground/60">{dict.booking.address}</dt>
          <dd className="text-right font-medium">{booking.address}</dd>
        </div>
        {booking.shopName && (
          <div className="flex justify-between gap-4">
            <dt className="text-foreground/60">{dict.booking.shopName}</dt>
            <dd className="font-medium">{booking.shopName}</dd>
          </div>
        )}
      </dl>

      <div className="flex justify-center">
        <Link href="/products" className={buttonClasses("secondary", "md")}>
          {dict.booking.continueBrowsing}
        </Link>
      </div>
    </div>
  );
}
