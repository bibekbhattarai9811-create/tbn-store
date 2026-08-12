import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Orders",
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const statuses = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export default async function AdminOrdersPage(props: PageProps<"/admin/orders">) {
  const searchParams = await props.searchParams;
  const status = typeof searchParams.status === "string" ? searchParams.status : "";

  const orders = await prisma.order.findMany({
    where:
      status && (statuses as readonly string[]).includes(status)
        ? { status: status as (typeof statuses)[number] }
        : undefined,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/orders"
          className={`rounded-full px-3 py-1.5 text-sm ${
            !status ? "bg-foreground text-background" : "bg-surface"
          }`}
        >
          All
        </Link>
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
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
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="font-medium hover:underline"
                  >
                    #{order.id.slice(-8).toUpperCase()}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span>{order.user.name}</span>
                    <span className="text-xs text-foreground/50">
                      {order.user.email}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-foreground/60">
                  {order.createdAt.toLocaleDateString()}
                </td>
                <td className="px-4 py-3">{order.status}</td>
                <td className="px-4 py-3 font-medium">
                  {currencyFormatter.format(order.totalAmount.toNumber())}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-foreground/60">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
