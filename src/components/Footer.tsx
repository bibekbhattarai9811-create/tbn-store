import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/lib/products";
import { auth } from "@/auth";
import { getLocale } from "@/i18n/locale";
import { getDictionary } from "@/i18n/dictionaries";

export async function Footer() {
  const [categories, session, locale] = await Promise.all([
    getCategories(),
    auth(),
    getLocale(),
  ]);
  const dict = getDictionary(locale).footer;

  return (
    <footer className="border-t border-border-subtle bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:grid-cols-4 sm:px-6 lg:px-8">
        <div className="col-span-2 flex flex-col gap-2 sm:col-span-1">
          <Image
            src="/logo.png"
            alt="TBN Store"
            width={1254}
            height={1254}
            sizes="96px"
            className="h-24 w-24 object-contain"
          />
          <p className="text-sm text-foreground/60">{dict.tagline}</p>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">{dict.shop}</span>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products/${category.slug}`}
              className="text-sm text-foreground/60 hover:text-foreground"
            >
              {category.name}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">{dict.accountHeading}</span>
          {session?.user ? (
            <Link href="/account" className="text-sm text-foreground/60 hover:text-foreground">
              {dict.yourAccount}
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm text-foreground/60 hover:text-foreground">
                {dict.signIn}
              </Link>
              <Link href="/register" className="text-sm text-foreground/60 hover:text-foreground">
                {dict.createAccount}
              </Link>
            </>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">{dict.company}</span>
          <Link href="/about" className="text-sm text-foreground/60 hover:text-foreground">
            {dict.about}
          </Link>
          <Link href="/contact" className="text-sm text-foreground/60 hover:text-foreground">
            {dict.contact}
          </Link>
          <Link
            href="/shipping-returns"
            className="text-sm text-foreground/60 hover:text-foreground"
          >
            {dict.shippingReturns}
          </Link>
          <Link href="/privacy" className="text-sm text-foreground/60 hover:text-foreground">
            {dict.privacyPolicy}
          </Link>
        </div>
      </div>
      <div className="border-t border-border-subtle px-4 py-4 text-center text-xs text-foreground/50 sm:px-6 lg:px-8">
        {dict.rights(new Date().getFullYear())}
      </div>
    </footer>
  );
}
