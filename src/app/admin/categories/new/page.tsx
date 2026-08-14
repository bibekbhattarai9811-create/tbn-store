import type { Metadata } from "next";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { createCategoryAction } from "../actions";
import { getLocale } from "@/i18n/locale";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: getDictionary(locale).admin.categories.newTitle };
}

export default async function NewCategoryPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">{dict.admin.categories.newTitle}</h1>
      <CategoryForm
        action={createCategoryAction}
        submitLabel={dict.admin.categories.createCategory}
        dict={{ form: dict.admin.categories.form, common: dict.common }}
      />
    </div>
  );
}
