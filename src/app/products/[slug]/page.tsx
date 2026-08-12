import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCategoryBySlug,
  getProductBySlug,
  getProducts,
} from "@/lib/products";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductGallery } from "@/components/ProductGallery";
import { PriceDisplay } from "@/components/PriceDisplay";
import { Rating } from "@/components/Rating";
import { BookingForm } from "@/components/BookingForm";
import { getStockState } from "@/types/product";
import { auth } from "@/auth";

export async function generateMetadata(
  props: PageProps<"/products/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;

  const category = await getCategoryBySlug(slug);
  if (category) {
    return { title: category.name };
  }

  const product = await getProductBySlug(slug);
  if (product) {
    return { title: product.name, description: product.description };
  }

  return {};
}

const stockLabel = {
  "in-stock": { text: "In stock", className: "text-emerald-700" },
  "low-stock": { text: "Low stock", className: "text-amber-700" },
  "out-of-stock": { text: "Out of stock", className: "text-foreground/50" },
};

export default async function ProductOrCategoryPage(
  props: PageProps<"/products/[slug]">
) {
  const { slug } = await props.params;

  const category = await getCategoryBySlug(slug);
  if (category) {
    const products = await getProducts({ categorySlug: category.slug });
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{category.name}</h1>
          <p className="text-sm text-foreground/60">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </div>
        <ProductGrid products={products} />
      </div>
    );
  }

  const product = await getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const stockState = getStockState(product.stock);
  const stock = stockLabel[stockState];
  const session = await auth();

  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
      <ProductGallery images={product.images} />

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wide text-foreground/50">
            {product.brand}
          </span>
          <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
          {product.avgRating != null && (
            <Rating value={product.avgRating} reviewCount={product.reviewCount} />
          )}
        </div>

        <PriceDisplay price={product.price} salePrice={product.salePrice} size="lg" />

        <p className={`text-sm font-medium ${stock.className}`}>{stock.text}</p>

        <p className="text-sm leading-relaxed text-foreground/70">
          {product.description}
        </p>

        <BookingForm
          productId={product.id}
          defaultName={session?.user?.name ?? undefined}
          defaultEmail={session?.user?.email ?? undefined}
        />

        <dl className="grid grid-cols-2 gap-3 border-t border-border-subtle pt-5 text-sm">
          <div>
            <dt className="text-foreground/50">SKU</dt>
            <dd>{product.sku}</dd>
          </div>
          <div>
            <dt className="text-foreground/50">Category</dt>
            <dd>{product.category.name}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
