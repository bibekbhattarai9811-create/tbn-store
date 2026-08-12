import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { buttonClasses } from "@/components/Button";

export const metadata: Metadata = {
  title: "Order confirmation",
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default async function OrderPage(props: PageProps<"/orders/[id]">) {
  const { id } = await props.params;
  const session = await auth();
  if (!session?.user) {
    redirect(`/login?callbackUrl=/orders/${id}`);
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            include: { images: { orderBy: { position: "asc" }, take: 1 } },
          },
        },
      },
    },
  });

  if (!order || order.userId !== session.user.id) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-16 sm:px-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Thank you for your order
        </h1>
        <p className="text-sm text-foreground/60">
          Order #{order.id.slice(-8).toUpperCase()} placed on{" "}
          {order.createdAt.toLocaleDateString()}
        </p>
      </div>

      <ul className="flex flex-col divide-y divide-border-subtle rounded-2xl border border-border-subtle">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-center gap-4 p-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface">
              {item.product.images[0] && (
                <Image
                  src={item.product.images[0].url}
                  alt={item.product.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex flex-1 flex-col">
              <Link
                href={`/products/${item.product.slug}`}
                className="text-sm font-medium hover:underline"
              >
                {item.product.name}
              </Link>
              <span className="text-xs text-foreground/50">Qty {item.quantity}</span>
            </div>
            <span className="text-sm font-semibold">
              {currencyFormatter.format(item.price.toNumber() * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <dl className="flex flex-col gap-2 rounded-2xl border border-border-subtle p-6 text-sm">
        <div className="flex justify-between">
          <dt className="text-foreground/60">Status</dt>
          <dd className="font-medium">{order.status}</dd>
        </div>
        <div className="flex justify-between border-t border-border-subtle pt-2 text-base font-semibold">
          <dt>Total</dt>
          <dd>{currencyFormatter.format(order.totalAmount.toNumber())}</dd>
        </div>
      </dl>

      <div className="flex justify-center">
        <Link href="/products" className={buttonClasses("secondary", "md")}>
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
