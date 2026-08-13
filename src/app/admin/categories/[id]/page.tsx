import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { updateCategoryAction, deleteCategoryAction } from "../actions";

export const metadata: Metadata = {
  title: "Edit category",
};

export default async function EditCategoryPage(
  props: PageProps<"/admin/categories/[id]">
) {
  const { id } = await props.params;
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Edit category</h1>
        <ConfirmDeleteButton
          label="Delete category"
          confirmMessage={`Delete "${category.name}"?`}
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
        submitLabel="Save changes"
      />
    </div>
  );
}
