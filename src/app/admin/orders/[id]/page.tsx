import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";
import { updateOrderStatusAction } from "../actions";

export const metadata: Metadata = {
  title: "Order detail",
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default async function AdminOrderDetailPage(
  props: PageProps<"/admin/orders/[id]">
) {
  const { id } = await props.params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      address: true,
      items: {
        include: {
          product: {
            include: { images: { orderBy: { position: "asc" }, take: 1 } },
          },
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Order #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-sm text-foreground/60">
            Placed {order.createdAt.toLocaleDateString()}
          </p>
        </div>
        <OrderStatusForm
          action={updateOrderStatusAction.bind(null, order.id)}
          currentStatus={order.status}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-3 lg:col-span-2">
          <h2 className="text-lg font-semibold">Items</h2>
          <ul className="flex flex-col divide-y divide-border-subtle rounded-2xl border border-border-subtle">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 p-4 text-sm">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-surface">
                  {item.product.images[0] && (
                    <Image
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col">
                  <Link
                    href={`/admin/products/${item.productId}`}
                    className="font-medium hover:underline"
                  >
                    {item.product.name}
                  </Link>
                  <span className="text-xs text-foreground/50">
                    Qty {item.quantity} × {currencyFormatter.format(item.price.toNumber())}
                  </span>
                </div>
                <span className="font-semibold">
                  {currencyFormatter.format(item.price.toNumber() * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 rounded-2xl border border-border-subtle p-4">
            <h2 className="text-sm font-semibold">Customer</h2>
            <p className="text-sm">{order.user.name}</p>
            <p className="text-sm text-foreground/60">{order.user.email}</p>
            <Link
              href={`/admin/customers/${order.user.id}`}
              className="text-sm hover:underline"
            >
              View customer
            </Link>
          </div>

          <dl className="flex flex-col gap-2 rounded-2xl border border-border-subtle p-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-foreground/60">Payment status</dt>
              <dd className="font-medium">{order.paymentStatus}</dd>
            </div>
            <div className="flex justify-between border-t border-border-subtle pt-2 text-base font-semibold">
              <dt>Total</dt>
              <dd>{currencyFormatter.format(order.totalAmount.toNumber())}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
