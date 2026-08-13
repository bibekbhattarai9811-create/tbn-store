"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { categorySchema } from "@/lib/validation";
import { isForeignKeyRestrictError } from "@/lib/db-errors";

export type CategoryActionState = { error?: string } | undefined;

function parseCategoryForm(formData: FormData) {
  return categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    position: formData.get("position"),
    imageUrl: formData.get("imageUrl"),
  });
}

export async function createCategoryAction(
  _prevState: CategoryActionState,
  formData: FormData
): Promise<CategoryActionState> {
  const session = await requireAdminAction();
  if (!session) return { error: "Unauthorized" };

  const parsed = parseCategoryForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await prisma.category.create({ data: parsed.data });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { error: "A category with that name or slug already exists." };
    }
    throw error;
  }

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategoryAction(
  categoryId: string,
  _prevState: CategoryActionState,
  formData: FormData
): Promise<CategoryActionState> {
  const session = await requireAdminAction();
  if (!session) return { error: "Unauthorized" };

  const parsed = parseCategoryForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await prisma.category.update({ where: { id: categoryId }, data: parsed.data });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { error: "A category with that name or slug already exists." };
    }
    throw error;
  }

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategoryAction(
  categoryId: string
): Promise<{ error?: string }> {
  const session = await requireAdminAction();
  if (!session) return { error: "Unauthorized" };

  try {
    await prisma.category.delete({ where: { id: categoryId } });
  } catch (error) {
    if (isForeignKeyRestrictError(error)) {
      return {
        error: "This category can't be deleted because it still has products.",
      };
    }
    throw error;
  }

  revalidatePath("/admin/categories");
  return {};
}
