import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getWishlistProducts } from "@/lib/wishlist";
import { ProductGrid } from "@/components/ProductGrid";
import { buttonClasses } from "@/components/Button";
import { getLocale } from "@/i18n/locale";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: getDictionary(locale).wishlist.pageTitle };
}

export default async function WishlistPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/wishlist");
  }

  const products = await getWishlistProducts(session.user.id);
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">{dict.wishlist.pageTitle}</h1>

      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-sm text-foreground/60">{dict.wishlist.empty}</p>
          <Link href="/products" className={buttonClasses("primary", "lg")}>
            {dict.wishlist.browse}
          </Link>
        </div>
      ) : (
        <ProductGrid products={products} dict={dict} />
      )}
    </div>
  );
}
