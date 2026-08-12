import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button, buttonClasses } from "@/components/Button";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { deleteProductAction } from "./actions";

export const metadata: Metadata = {
  title: "Products",
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default async function AdminProductsPage(props: PageProps<"/admin/products">) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q.trim() : "";

  const products = await prisma.product.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { sku: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: { category: true, images: { orderBy: { position: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
        <Link href="/admin/products/new" className={buttonClasses("primary", "md")}>
          Add product
        </Link>
      </div>

      <form className="max-w-sm">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search by name or SKU"
          className="h-11 w-full rounded-full border border-border-subtle bg-surface px-4 text-sm outline-none focus:border-foreground"
        />
      </form>

      <div className="overflow-x-auto rounded-2xl border border-border-subtle">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border-subtle bg-surface text-xs uppercase text-foreground/50">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="flex items-center gap-3 px-4 py-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-surface">
                    {product.images[0] && (
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-xs text-foreground/50">{product.sku}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{product.category.name}</td>
                <td className="px-4 py-3">
                  {currencyFormatter.format(
                    (product.salePrice ?? product.price).toNumber()
                  )}
                </td>
                <td className="px-4 py-3">{product.stock}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/products/${product.id}`}>
                      <Button variant="secondary" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <ConfirmDeleteButton
                      confirmMessage={`Delete "${product.name}"? This can't be undone.`}
                      action={deleteProductAction.bind(null, product.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-foreground/60">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
