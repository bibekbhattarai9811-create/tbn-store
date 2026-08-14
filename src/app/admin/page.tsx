import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/i18n/locale";
import { getDictionary } from "@/i18n/dictionaries";
import { tf } from "@/i18n/format";

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-border-subtle p-5">
      <span className="text-sm text-foreground/60">{label}</span>
      <span className="text-2xl font-semibold tracking-tight">{value}</span>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);

  const [
    bookingCount,
    pendingCount,
    customerCount,
    productCount,
    recentBookings,
    topItems,
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count(),
    prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { product: { select: { name: true } } },
    }),
    prisma.booking.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
  ]);

  const topProducts = await prisma.product.findMany({
    where: { id: { in: topItems.map((item) => item.productId) } },
    select: { id: true, name: true, slug: true },
  });
  const topProductsWithCount = topItems.map((item) => ({
    quantity: item._sum.quantity ?? 0,
    product: topProducts.find((product) => product.id === item.productId),
  }));

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold tracking-tight">{dict.admin.dashboard.title}</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label={dict.admin.dashboard.totalBookings} value={String(bookingCount)} />
        <StatCard label={dict.admin.dashboard.pending} value={String(pendingCount)} />
        <StatCard label={dict.admin.dashboard.customers} value={String(customerCount)} />
        <StatCard label={dict.admin.dashboard.products} value={String(productCount)} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{dict.admin.dashboard.recentBookings}</h2>
            <Link href="/admin/bookings" className="text-sm hover:underline">
              {dict.common.viewAll}
            </Link>
          </div>
          <ul className="flex flex-col divide-y divide-border-subtle rounded-2xl border border-border-subtle">
            {recentBookings.length === 0 && (
              <li className="p-4 text-sm text-foreground/60">
                {dict.admin.dashboard.noBookingsYet}
              </li>
            )}
            {recentBookings.map((booking) => (
              <li key={booking.id}>
                <Link
                  href={`/admin/bookings/${booking.id}`}
                  className="flex items-center justify-between gap-4 p-4 text-sm hover:bg-surface"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{booking.fullName}</span>
                    <span className="text-xs text-foreground/50">
                      {booking.product.name}
                    </span>
                  </div>
                  <span className="font-semibold">{dict.bookingStatus[booking.status]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">{dict.admin.dashboard.mostBooked}</h2>
          <ul className="flex flex-col divide-y divide-border-subtle rounded-2xl border border-border-subtle">
            {topProductsWithCount.length === 0 && (
              <li className="p-4 text-sm text-foreground/60">
                {dict.admin.dashboard.noBookingsYet}
              </li>
            )}
            {topProductsWithCount.map(({ product, quantity }) =>
              product ? (
                <li key={product.id}>
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="flex items-center justify-between gap-4 p-4 text-sm hover:bg-surface"
                  >
                    <span className="font-medium">{product.name}</span>
                    <span className="text-foreground/60">
                      {tf(dict.admin.dashboard.requested, { n: quantity })}
                    </span>
                  </Link>
                </li>
              ) : null
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
