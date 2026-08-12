import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/admin";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | Admin",
  },
};

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  await requireAdminPage();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
      <AdminSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
