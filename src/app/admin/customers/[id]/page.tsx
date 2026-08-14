import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { getLocale } from "@/i18n/locale";
import { getDictionary } from "@/i18n/dictionaries";
import { tf } from "@/i18n/format";
import { RoleForm } from "@/components/admin/RoleForm";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: (await getDictionary(locale)).account.pageTitle };
}

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

  const [locale, session] = await Promise.all([getLocale(), auth()]);
  const dict = await getDictionary(locale);
  const c = dict.admin.customers;
  const isSelf = session?.user?.id === user.id;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{user.name}</h1>
        <p className="text-sm text-foreground/60">{user.email}</p>
      </div>

      <dl className="flex flex-col gap-2 rounded-2xl border border-border-subtle p-4 text-sm sm:w-fit sm:min-w-64">
        <div className="flex justify-between gap-8">
          <dt className="text-foreground/60">{c.role}</dt>
          <dd className="font-medium">{dict.admin.role[user.role]}</dd>
        </div>
        <div className="flex justify-between gap-8">
          <dt className="text-foreground/60">{c.joined}</dt>
          <dd className="font-medium">{user.createdAt.toLocaleDateString()}</dd>
        </div>
      </dl>

      <div className="max-w-xs">
        {isSelf ? (
          <p className="text-sm text-foreground/50">{c.cannotChangeOwnRole}</p>
        ) : (
          <RoleForm
            userId={user.id}
            currentRole={user.role}
            roleLabels={dict.admin.role}
            dict={{
              changeRole: c.changeRole,
              updateRole: c.updateRole,
              updatingRole: c.updatingRole,
              roleUpdated: c.roleUpdated,
            }}
          />
        )}
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">{c.bookings}</h2>
        {user.bookings.length === 0 ? (
          <p className="text-sm text-foreground/60">{c.noBookingsYet}</p>
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
                      {booking.createdAt.toLocaleDateString()} ·{" "}
                      {dict.bookingStatus[booking.status]}
                    </span>
                  </div>
                  <span className="font-semibold">{tf(c.qty, { n: booking.quantity })}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
