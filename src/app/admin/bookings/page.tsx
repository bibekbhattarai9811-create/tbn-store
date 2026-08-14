import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Bookings",
};

const statuses = ["PENDING", "CONTACTED", "CONFIRMED", "CANCELLED"] as const;

function statusHref(status: string, q: string) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (q) params.set("q", q);
  const query = params.toString();
  return query ? `/admin/bookings?${query}` : "/admin/bookings";
}

export default async function AdminBookingsPage(props: PageProps<"/admin/bookings">) {
  const searchParams = await props.searchParams;
  const status = typeof searchParams.status === "string" ? searchParams.status : "";
  const q = typeof searchParams.q === "string" ? searchParams.q.trim() : "";

  const bookings = await prisma.booking.findMany({
    where: {
      ...(status && (statuses as readonly string[]).includes(status)
        ? { status: status as (typeof statuses)[number] }
        : {}),
      ...(q
        ? {
            OR: [
              { fullName: { contains: q, mode: "insensitive" } },
              { phone: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { product: { select: { name: true, slug: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Bookings</h1>

      <form className="max-w-sm">
        {status && <input type="hidden" name="status" value={status} />}
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search by name, phone, or email"
          className="h-11 w-full rounded-full border border-border-subtle bg-surface px-4 text-sm outline-none focus:border-foreground"
        />
      </form>

      <div className="flex flex-wrap gap-2">
        <Link
          href={statusHref("", q)}
          className={`rounded-full px-3 py-1.5 text-sm ${
            !status ? "bg-foreground text-background" : "bg-surface"
          }`}
        >
          All
        </Link>
        {statuses.map((s) => (
          <Link
            key={s}
            href={statusHref(s, q)}
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
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Size</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="px-4 py-3 text-foreground/60">#{booking.bookingNumber}</td>
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
                <td className="px-4 py-3 text-foreground/60">{booking.size ?? "—"}</td>
                <td className="px-4 py-3">{booking.quantity}</td>
                <td className="px-4 py-3 text-foreground/60">
                  {booking.createdAt.toLocaleDateString()}
                </td>
                <td className="px-4 py-3">{booking.status}</td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-foreground/60">
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
