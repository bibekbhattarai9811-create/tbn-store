import Link from "next/link";
import { prisma } from "@/lib/prisma";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-border-subtle p-5">
      <span className="text-sm text-foreground/60">{label}</span>
      <span className="text-2xl font-semibold tracking-tight">{value}</span>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const [salesAgg, orderCount, customerCount, productCount, recentOrders, topItems] =
    await Promise.all([
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { paymentStatus: "SUCCEEDED" },
      }),
      prisma.order.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.product.count(),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { user: { select: { name: true, email: true } } },
      }),
      prisma.orderItem.groupBy({
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
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Total sales"
          value={currencyFormatter.format(salesAgg._sum.totalAmount?.toNumber() ?? 0)}
        />
        <StatCard label="Orders" value={String(orderCount)} />
        <StatCard label="Customers" value={String(customerCount)} />
        <StatCard label="Products" value={String(productCount)} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm hover:underline">
              View all
            </Link>
          </div>
          <ul className="flex flex-col divide-y divide-border-subtle rounded-2xl border border-border-subtle">
            {recentOrders.length === 0 && (
              <li className="p-4 text-sm text-foreground/60">No orders yet.</li>
            )}
            {recentOrders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between gap-4 p-4 text-sm hover:bg-surface"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{order.user.name}</span>
                    <span className="text-xs text-foreground/50">{order.status}</span>
                  </div>
                  <span className="font-semibold">
                    {currencyFormatter.format(order.totalAmount.toNumber())}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Best-selling products</h2>
          <ul className="flex flex-col divide-y divide-border-subtle rounded-2xl border border-border-subtle">
            {topProductsWithCount.length === 0 && (
              <li className="p-4 text-sm text-foreground/60">No sales yet.</li>
            )}
            {topProductsWithCount.map(({ product, quantity }) =>
              product ? (
                <li key={product.id}>
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="flex items-center justify-between gap-4 p-4 text-sm hover:bg-surface"
                  >
                    <span className="font-medium">{product.name}</span>
                    <span className="text-foreground/60">{quantity} sold</span>
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
