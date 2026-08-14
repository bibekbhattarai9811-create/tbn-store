import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { updateCategoryAction, deleteCategoryAction } from "../actions";
import { getLocale } from "@/i18n/locale";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: getDictionary(locale).admin.categories.editTitle };
}

export default async function EditCategoryPage(
  props: PageProps<"/admin/categories/[id]">
) {
  const { id } = await props.params;
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) {
    notFound();
  }

  const locale = await getLocale();
  const dict = getDictionary(locale);
  const c = dict.admin.categories;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">{c.editTitle}</h1>
        <ConfirmDeleteButton
          label={c.deleteCategory}
          deletingLabel={dict.common.deleting}
          confirmMessage={c.deleteConfirm(category.name)}
          action={deleteCategoryAction.bind(null, category.id)}
          redirectTo="/admin/categories"
        />
      </div>
      <CategoryForm
        action={updateCategoryAction.bind(null, category.id)}
        defaultValues={{
          name: category.name,
          slug: category.slug,
          position: category.position,
          imageUrl: category.imageUrl,
        }}
        submitLabel={c.saveChanges}
        dict={{ form: c.form, common: dict.common }}
      />
    </div>
  );
}
