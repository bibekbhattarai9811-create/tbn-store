import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Customer detail",
};

export default async function AdminCustomerDetailPage(
  props: PageProps<"/admin/customers/[id]">
) {
  const { id } = await props.params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      bookings: { orderBy: { createdAt: "desc" }, include: { product: true } },
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{user.name}</h1>
        <p className="text-sm text-foreground/60">{user.email}</p>
      </div>

      <dl className="flex flex-col gap-2 rounded-2xl border border-border-subtle p-4 text-sm sm:w-fit sm:min-w-64">
        <div className="flex justify-between gap-8">
          <dt className="text-foreground/60">Role</dt>
          <dd className="font-medium">{user.role}</dd>
        </div>
        <div className="flex justify-between gap-8">
          <dt className="text-foreground/60">Joined</dt>
          <dd className="font-medium">{user.createdAt.toLocaleDateString()}</dd>
        </div>
      </dl>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Bookings</h2>
        {user.bookings.length === 0 ? (
          <p className="text-sm text-foreground/60">No bookings yet.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-border-subtle rounded-2xl border border-border-subtle">
            {user.bookings.map((booking) => (
              <li key={booking.id}>
                <Link
                  href={`/admin/bookings/${booking.id}`}
                  className="flex items-center justify-between gap-4 p-4 text-sm hover:bg-surface"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{booking.product.name}</span>
                    <span className="text-xs text-foreground/50">
                      {booking.createdAt.toLocaleDateString()} · {booking.status}
                    </span>
                  </div>
                  <span className="font-semibold">Qty {booking.quantity}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
