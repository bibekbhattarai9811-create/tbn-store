import { getCategories } from "@/lib/products";
import { auth } from "@/auth";
import { NavbarClient } from "@/components/NavbarClient";
import { getLocale } from "@/i18n/locale";
import { getDictionary } from "@/i18n/dictionaries";

export async function Navbar() {
  const [categories, session, locale] = await Promise.all([
    getCategories(),
    auth(),
    getLocale(),
  ]);
  const dict = await getDictionary(locale);
  return (
    <NavbarClient
      categories={categories}
      user={session?.user ?? null}
      locale={locale}
      dict={dict.nav}
    />
  );
}
