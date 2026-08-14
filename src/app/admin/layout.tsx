import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/admin";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getLocale } from "@/i18n/locale";
import { getDictionary } from "@/i18n/dictionaries";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | Admin",
  },
};

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  await requireAdminPage();
  const locale = await getLocale();
  const dict = await getDictionary(locale);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
      <AdminSidebar dict={dict.admin.nav} locale={locale} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
