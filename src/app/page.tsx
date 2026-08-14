import Link from "next/link";
import Image from "next/image";
import { buttonClasses } from "@/components/Button";
import { ProductGrid } from "@/components/ProductGrid";
import { getCategories, getFeaturedProducts } from "@/lib/products";
import { getSiteSettings } from "@/lib/settings";
import { getLocale } from "@/i18n/locale";
import { getDictionary } from "@/i18n/dictionaries";

export default async function Home() {
  const [categories, featuredProducts, settings, locale] = await Promise.all([
    getCategories(),
    getFeaturedProducts(8),
    getSiteSettings(),
    getLocale(),
  ]);
  const fullDict = await getDictionary(locale);
  const dict = fullDict.home;
  const heroImageUrl =
    settings?.heroImageUrl || "https://picsum.photos/seed/tbn-store-hero/1600/900";

  return (
    <div className="flex flex-col">
      <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-surface">
        <Image
          src={heroImageUrl}
          alt=""
          fill
          priority
          className="object-cover opacity-70"
        />
        <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
          <h1 className="max-w-lg text-4xl font-semibold tracking-tight sm:text-5xl">
            {dict.heroTitle}
          </h1>
          <p className="max-w-md text-lg text-foreground/70">{dict.heroSubtitle}</p>
          <div>
            <Link href="/products" className={buttonClasses("primary", "lg")}>
              {dict.shopNow}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products/${category.slug}`}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-border-subtle p-4 text-center transition-colors hover:bg-surface"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-surface">
                <Image
                  src={
                    category.imageUrl ||
                    `https://picsum.photos/seed/${category.slug}/300/300`
                  }
                  alt=""
                  fill
                  sizes="20vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="text-sm font-medium">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">
            {dict.featuredProducts}
          </h2>
          <Link href="/products" className="text-sm font-medium hover:underline">
            {fullDict.common.viewAll}
          </Link>
        </div>
        <ProductGrid products={featuredProducts} dict={fullDict} />
      </section>
    </div>
  );
}
