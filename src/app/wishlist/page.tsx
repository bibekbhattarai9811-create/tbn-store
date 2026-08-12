import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getWishlistProducts } from "@/lib/wishlist";
import { ProductGrid } from "@/components/ProductGrid";
import { buttonClasses } from "@/components/Button";

export const metadata: Metadata = {
  title: "Your wishlist",
};

export default async function WishlistPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/wishlist");
  }

  const products = await getWishlistProducts(session.user.id);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">Your wishlist</h1>

      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-sm text-foreground/60">
            You haven&apos;t saved anything yet.
          </p>
          <Link href="/products" className={buttonClasses("primary", "lg")}>
            Browse products
          </Link>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
