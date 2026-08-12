import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductFilters } from "@/components/ProductFilters";
import { ProductGrid } from "@/components/ProductGrid";
import { products as allProducts } from "@/lib/mock-data";
import type { Product } from "@/types/product";

export const metadata: Metadata = {
  title: "Shop all products",
};

function sortProducts(products: Product[], sort: string | undefined) {
  const sorted = [...products];
  switch (sort) {
    case "price-asc":
      return sorted.sort(
        (a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price)
      );
    case "price-desc":
      return sorted.sort(
        (a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price)
      );
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "newest":
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    default:
      return sorted;
  }
}

export default async function ProductsPage(props: PageProps<"/products">) {
  const searchParams = await props.searchParams;
  const query = typeof searchParams.q === "string" ? searchParams.q.trim().toLowerCase() : "";
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : undefined;

  const filtered = query
    ? allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.category.name.toLowerCase().includes(query)
      )
    : allProducts;

  const products = sortProducts(filtered, sort);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">Shop all products</h1>
      <Suspense fallback={<div className="h-11" />}>
        <ProductFilters resultCount={products.length} />
      </Suspense>
      <ProductGrid products={products} />
    </div>
  );
}
