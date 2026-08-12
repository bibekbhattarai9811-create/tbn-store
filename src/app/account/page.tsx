import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/Button";
import { signOutAction } from "@/app/actions";

export const metadata: Metadata = {
  title: "Your account",
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/account");
  }

  const { user } = session;

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-8 px-4 py-16 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Your account</h1>
        <p className="text-sm text-foreground/60">
          Manage your profile details.
        </p>
      </div>

      <dl className="flex flex-col gap-4 rounded-2xl border border-border-subtle p-6">
        <div className="flex justify-between text-sm">
          <dt className="text-foreground/60">Name</dt>
          <dd className="font-medium">{user.name}</dd>
        </div>
        <div className="flex justify-between text-sm">
          <dt className="text-foreground/60">Email</dt>
          <dd className="font-medium">{user.email}</dd>
        </div>
        <div className="flex justify-between text-sm">
          <dt className="text-foreground/60">Role</dt>
          <dd className="font-medium">{user.role}</dd>
        </div>
      </dl>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Order history</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-foreground/60">
            You haven&apos;t placed any orders yet.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-border-subtle rounded-2xl border border-border-subtle">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/orders/${order.id}`}
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

      <form action={signOutAction}>
        <Button type="submit" variant="secondary">
          Sign out
        </Button>
      </form>
    </div>
  );
}
