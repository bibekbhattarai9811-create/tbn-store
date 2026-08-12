import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Bookings",
};

const statuses = ["PENDING", "CONTACTED", "CONFIRMED", "CANCELLED"] as const;

export default async function AdminBookingsPage(props: PageProps<"/admin/bookings">) {
  const searchParams = await props.searchParams;
  const status = typeof searchParams.status === "string" ? searchParams.status : "";

  const bookings = await prisma.booking.findMany({
    where:
      status && (statuses as readonly string[]).includes(status)
        ? { status: status as (typeof statuses)[number] }
        : undefined,
    orderBy: { createdAt: "desc" },
    include: { product: { select: { name: true, slug: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Bookings</h1>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/bookings"
          className={`rounded-full px-3 py-1.5 text-sm ${
            !status ? "bg-foreground text-background" : "bg-surface"
          }`}
        >
          All
        </Link>
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/admin/bookings?status=${s}`}
            className={`rounded-full px-3 py-1.5 text-sm ${
              status === s ? "bg-foreground text-background" : "bg-surface"
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border-subtle">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border-subtle bg-surface text-xs uppercase text-foreground/50">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/bookings/${booking.id}`}
                    className="flex flex-col hover:underline"
                  >
                    <span className="font-medium">{booking.fullName}</span>
                    <span className="text-xs text-foreground/50">{booking.phone}</span>
                  </Link>
                </td>
                <td className="px-4 py-3">{booking.product.name}</td>
                <td className="px-4 py-3">{booking.quantity}</td>
                <td className="px-4 py-3 text-foreground/60">
                  {booking.createdAt.toLocaleDateString()}
                </td>
                <td className="px-4 py-3">{booking.status}</td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-foreground/60">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
