import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/i18n/locale";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: (await getDictionary(locale)).admin.customers.title };
}

export default async function AdminCustomersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { bookings: true } } },
  });
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const c = dict.admin.customers;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">{c.title}</h1>

      <div className="overflow-x-auto rounded-2xl border border-border-subtle">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border-subtle bg-surface text-xs uppercase text-foreground/50">
            <tr>
              <th className="px-4 py-3">{c.colName}</th>
              <th className="px-4 py-3">{c.colEmail}</th>
              <th className="px-4 py-3">{c.colRole}</th>
              <th className="px-4 py-3">{c.colBookings}</th>
              <th className="px-4 py-3">{c.colJoined}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/customers/${user.id}`}
                    className="font-medium hover:underline"
                  >
                    {user.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-foreground/60">{user.email}</td>
                <td className="px-4 py-3">{dict.admin.role[user.role]}</td>
                <td className="px-4 py-3">{user._count.bookings}</td>
                <td className="px-4 py-3 text-foreground/60">
                  {user.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
