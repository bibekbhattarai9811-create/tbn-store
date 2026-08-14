"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locale";

export function AdminSidebar({
  dict,
  locale,
}: {
  dict: Dictionary["admin"]["nav"];
  locale: Locale;
}) {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: dict.dashboard, exact: true },
    { href: "/admin/products", label: dict.products },
    { href: "/admin/categories", label: dict.categories },
    { href: "/admin/bookings", label: dict.bookings },
    { href: "/admin/reviews", label: dict.reviews },
    { href: "/admin/customers", label: dict.customers },
    { href: "/admin/settings", label: dict.settings },
  ];

  return (
    <nav className="flex w-48 shrink-0 flex-col gap-3">
      <LanguageSwitcher locale={locale} />
      <div className="flex flex-col gap-1">
        {links.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                active
                  ? "bg-foreground text-background"
                  : "text-foreground/70 hover:bg-surface"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
