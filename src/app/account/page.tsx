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

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/account");
  }

  const { user } = session;

  const bookings = await prisma.booking.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { product: { select: { name: true } } },
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
        <h2 className="text-lg font-semibold">Your bookings</h2>
        {bookings.length === 0 ? (
          <p className="text-sm text-foreground/60">
            You haven&apos;t booked any products yet.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-border-subtle rounded-2xl border border-border-subtle">
            {bookings.map((booking) => (
              <li key={booking.id}>
                <Link
                  href={`/bookings/${booking.id}`}
                  className="flex items-center justify-between gap-4 p-4 text-sm hover:bg-surface"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{booking.product.name}</span>
                    <span className="text-xs text-foreground/50">
                      {booking.createdAt.toLocaleDateString()} · Qty {booking.quantity}
                    </span>
                  </div>
                  <span className="font-semibold">{booking.status}</span>
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
