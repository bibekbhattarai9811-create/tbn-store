import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/currency";
import { Button, buttonClasses } from "@/components/Button";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { FeaturedToggle } from "@/components/admin/FeaturedToggle";
import { deleteProductAction } from "./actions";
import { getLocale } from "@/i18n/locale";
import { getDictionary } from "@/i18n/dictionaries";
import { tf } from "@/i18n/format";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: (await getDictionary(locale)).admin.products.title };
}

export default async function AdminProductsPage(props: PageProps<"/admin/products">) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q.trim() : "";
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const p = dict.admin.products;

  const productWhere = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { sku: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : undefined;

  const categories = await prisma.category.findMany({
    orderBy: [{ position: "asc" }, { name: "asc" }],
    include: {
      products: {
        where: productWhere,
        include: { images: { orderBy: { position: "asc" }, take: 1 } },
        orderBy: { name: "asc" },
      },
    },
  });

  const visibleCategories = q
    ? categories.filter((category) => category.products.length > 0)
    : categories;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">{p.title}</h1>
        <Link href="/admin/products/new" className={buttonClasses("primary", "md")}>
          {p.addProduct}
        </Link>
      </div>

      <form className="max-w-sm">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder={p.searchPlaceholder}
          className="h-11 w-full rounded-full border border-border-subtle bg-surface px-4 text-sm outline-none focus:border-foreground"
        />
      </form>

      <div className="flex flex-col gap-8">
        {visibleCategories.map((category) => (
          <div key={category.id} className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold tracking-tight">
              {category.name}{" "}
              <span className="text-sm font-normal text-foreground/50">
                ({category.products.length})
              </span>
            </h2>

            <div className="overflow-x-auto rounded-2xl border border-border-subtle">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border-subtle bg-surface text-xs uppercase text-foreground/50">
                  <tr>
                    <th className="px-4 py-3" />
                    <th className="px-4 py-3">{p.colProduct}</th>
                    <th className="px-4 py-3">{p.colPrice}</th>
                    <th className="px-4 py-3">{p.colStock}</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {category.products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-4 py-3">
                        <FeaturedToggle
                          productId={product.id}
                          initialFeatured={product.featured}
                          markLabel={p.markFeatured}
                          removeLabel={p.removeFeatured}
                        />
                      </td>
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
                      <td className="px-4 py-3">
                        {formatCurrency((product.salePrice ?? product.price).toNumber())}
                      </td>
                      <td className="px-4 py-3">{product.stock}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/products/${product.id}`}>
                            <Button variant="secondary" size="sm">
                              {dict.common.edit}
                            </Button>
                          </Link>
                          <ConfirmDeleteButton
                            confirmMessage={tf(p.deleteConfirm, { name: product.name })}
                            action={deleteProductAction.bind(null, product.id)}
                            label={dict.common.delete}
                            deletingLabel={dict.common.deleting}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                  {category.products.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-foreground/60">
                        {p.noProductsInCategory}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {visibleCategories.length === 0 && (
          <p className="rounded-2xl border border-border-subtle px-4 py-8 text-center text-sm text-foreground/60">
            {p.noProductsFound}
          </p>
        )}
      </div>
    </div>
  );
}
