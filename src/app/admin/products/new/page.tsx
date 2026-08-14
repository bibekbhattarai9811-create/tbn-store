import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import { createProductAction } from "../actions";
import { getLocale } from "@/i18n/locale";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: (await getDictionary(locale)).admin.products.newTitle };
}

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const locale = await getLocale();
  const dict = await getDictionary(locale);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">{dict.admin.products.newTitle}</h1>
      <ProductForm
        action={createProductAction}
        categories={categories}
        submitLabel={dict.admin.products.createProduct}
        dict={{ form: dict.admin.products.form, common: dict.common }}
      />
    </div>
  );
}
