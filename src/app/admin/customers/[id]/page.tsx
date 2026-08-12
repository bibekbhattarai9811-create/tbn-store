import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Customer detail",
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default async function AdminCustomerDetailPage(
  props: PageProps<"/admin/customers/[id]">
) {
  const { id } = await props.params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: { orders: { orderBy: { createdAt: "desc" } } },
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
        <h2 className="text-lg font-semibold">Orders</h2>
        {user.orders.length === 0 ? (
          <p className="text-sm text-foreground/60">No orders yet.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-border-subtle rounded-2xl border border-border-subtle">
            {user.orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between gap-4 p-4 text-sm hover:bg-surface"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </span>
                    <span className="text-xs text-foreground/50">
                      {order.createdAt.toLocaleDateString()} · {order.status}
                    </span>
                  </div>
                  <span className="font-semibold">
                    {currencyFormatter.format(order.totalAmount.toNumber())}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
