import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button, buttonClasses } from "@/components/Button";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { deleteCategoryAction } from "./actions";
import { getLocale } from "@/i18n/locale";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: getDictionary(locale).admin.categories.title };
}

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: [{ position: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } },
  });
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const c = dict.admin.categories;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">{c.title}</h1>
        <Link href="/admin/categories/new" className={buttonClasses("primary", "md")}>
          {c.addCategory}
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border-subtle">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border-subtle bg-surface text-xs uppercase text-foreground/50">
            <tr>
              <th className="px-4 py-3" />
              <th className="px-4 py-3">{c.colOrder}</th>
              <th className="px-4 py-3">{c.colName}</th>
              <th className="px-4 py-3">{c.colSlug}</th>
              <th className="px-4 py-3">{c.colProducts}</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-4 py-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-surface">
                    {category.imageUrl && (
                      <Image
                        src={category.imageUrl}
                        alt={category.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-foreground/60">{category.position}</td>
                <td className="px-4 py-3 font-medium">{category.name}</td>
                <td className="px-4 py-3 text-foreground/60">{category.slug}</td>
                <td className="px-4 py-3">{category._count.products}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/categories/${category.id}`}>
                      <Button variant="secondary" size="sm">
                        {dict.common.edit}
                      </Button>
                    </Link>
                    <ConfirmDeleteButton
                      confirmMessage={c.deleteConfirm(category.name)}
                      action={deleteCategoryAction.bind(null, category.id)}
                      label={dict.common.delete}
                      deletingLabel={dict.common.deleting}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-foreground/60">
                  {c.noCategoriesYet}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
