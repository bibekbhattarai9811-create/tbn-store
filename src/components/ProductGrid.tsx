import type { Product } from "@/types/product";
import { ProductCard } from "@/components/ProductCard";
import type { Dictionary } from "@/i18n/dictionaries";

export function ProductGrid({
  products,
  dict,
}: {
  products: Product[];
  dict: Pick<Dictionary, "products" | "product">;
}) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border-subtle py-24 text-center">
        <p className="text-sm font-medium">{dict.products.noProducts}</p>
        <p className="text-sm text-foreground/60">{dict.products.noProductsHint}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} dict={dict.product} />
      ))}
    </div>
  );
}
