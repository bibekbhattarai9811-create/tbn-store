import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Customers",
};

export default async function AdminCustomersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>

      <div className="overflow-x-auto rounded-2xl border border-border-subtle">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border-subtle bg-surface text-xs uppercase text-foreground/50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Joined</th>
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
                <td className="px-4 py-3">{user.role}</td>
                <td className="px-4 py-3">{user._count.orders}</td>
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
