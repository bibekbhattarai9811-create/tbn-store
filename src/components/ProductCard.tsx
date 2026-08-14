import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { getStockState } from "@/types/product";
import { PriceDisplay } from "@/components/PriceDisplay";
import { Rating } from "@/components/Rating";
import type { Dictionary } from "@/i18n/dictionaries";

export function ProductCard({
  product,
  dict,
}: {
  product: Product;
  dict: Dictionary["product"];
}) {
  const stockState = getStockState(product.stock);
  const stockBadge = {
    "in-stock": null,
    "low-stock": { label: dict.lowStock, className: "bg-amber-100 text-amber-800" },
    "out-of-stock": {
      label: dict.outOfStock,
      className: "bg-foreground/10 text-foreground/60",
    },
  };
  const badge = stockBadge[stockState];
  const image = product.images[0];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col gap-3"
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface">
        {image && (
          <Image
            src={image.url}
            alt={image.altText}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        {product.salePrice != null && stockState !== "out-of-stock" && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
            {dict.sale}
          </span>
        )}
        {badge && (
          <span
            className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium ${badge.className}`}
          >
            {badge.label}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs uppercase tracking-wide text-foreground/50">
          {product.brand}
        </span>
        <h3 className="text-sm font-medium leading-snug">{product.name}</h3>
        {product.avgRating != null && (
          <Rating value={product.avgRating} reviewCount={product.reviewCount} />
        )}
        <PriceDisplay price={product.price} salePrice={product.salePrice} />
      </div>
    </Link>
  );
}
