import type { Metadata } from "next";
import { requireHelperPage } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/currency";
import { getLocale } from "@/i18n/locale";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: (await getDictionary(locale)).helper.pageTitle };
}

export default async function HelperPage(props: PageProps<"/helper">) {
  await requireHelperPage();

  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q.trim() : "";

  const locale = await getLocale();
  const dict = (await getDictionary(locale)).helper;

  const products = await prisma.product.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { sku: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { name: "asc" },
    select: { id: true, name: true, sku: true, price: true, salePrice: true, costPrice: true },
  });

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{dict.pageTitle}</h1>
        <p className="text-sm text-foreground/60">{dict.subtitle}</p>
      </div>

      <form className="max-w-sm">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder={dict.searchPlaceholder}
          className="h-11 w-full rounded-full border border-border-subtle bg-surface px-4 text-sm outline-none focus:border-foreground"
        />
      </form>

      <div className="overflow-x-auto rounded-2xl border border-border-subtle">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border-subtle bg-surface text-xs uppercase text-foreground/50">
            <tr>
              <th className="px-4 py-3">{dict.colProduct}</th>
              <th className="px-4 py-3">{dict.colNumber}</th>
              <th className="px-4 py-3">{dict.colCostPrice}</th>
              <th className="px-4 py-3">{dict.colSalePrice}</th>
              <th className="px-4 py-3">{dict.colMargin}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {products.map((product) => {
              const salePrice = (product.salePrice ?? product.price).toNumber();
              const costPrice = product.costPrice?.toNumber() ?? null;
              const margin = costPrice != null ? salePrice - costPrice : null;
              const marginPercent =
                margin != null && salePrice > 0 ? (margin / salePrice) * 100 : null;

              return (
                <tr key={product.id}>
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className="px-4 py-3 text-foreground/60">{product.sku}</td>
                  <td className="px-4 py-3">
                    {costPrice != null ? (
                      formatCurrency(costPrice)
                    ) : (
                      <span className="text-foreground/40">{dict.notSet}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{formatCurrency(salePrice)}</td>
                  <td className="px-4 py-3">
                    {margin != null ? (
                      <span
                        className={margin >= 0 ? "text-emerald-700" : "text-danger"}
                      >
                        {formatCurrency(margin)} ({marginPercent!.toFixed(0)}%)
                      </span>
                    ) : (
                      <span className="text-foreground/40">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-foreground/60">
                  {dict.noProductsFound}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
