"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { productSchema } from "@/lib/validation";
import { isForeignKeyRestrictError } from "@/lib/db-errors";

export type ProductActionState = { error?: string } | undefined;

function parseImages(raw: FormDataEntryValue | null): string[] {
  if (typeof raw !== "string") return [];
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseSalePrice(raw: FormDataEntryValue | null): number | null | "invalid" {
  if (typeof raw !== "string" || raw.trim() === "") return null;
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) return "invalid";
  return value;
}

function parseFeatured(raw: FormDataEntryValue | null): boolean {
  return raw != null;
}

function parseProductForm(formData: FormData) {
  return productSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    price: formData.get("price"),
    sku: formData.get("sku"),
    stock: formData.get("stock"),
    brand: (formData.get("brand") as string) || undefined,
    categoryId: formData.get("categoryId"),
  });
}

export async function createProductAction(
  _prevState: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  const session = await requireAdminAction();
  if (!session) return { error: "Unauthorized" };

  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const salePrice = parseSalePrice(formData.get("salePrice"));
  if (salePrice === "invalid") {
    return { error: "Sale price must be a positive number" };
  }

  const images = parseImages(formData.get("images"));
  const featured = parseFeatured(formData.get("featured"));

  let productId: string;
  try {
    const product = await prisma.product.create({
      data: {
        ...parsed.data,
        salePrice,
        featured,
        images: {
          create: images.map((url, index) => ({
            url,
            altText: parsed.data.name,
            position: index,
          })),
        },
      },
    });
    productId = product.id;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { error: "A product with that slug or SKU already exists." };
    }
    throw error;
  }

  revalidatePath("/admin/products");
  redirect(`/admin/products/${productId}`);
}

export async function updateProductAction(
  productId: string,
  _prevState: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  const session = await requireAdminAction();
  if (!session) return { error: "Unauthorized" };

  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const salePrice = parseSalePrice(formData.get("salePrice"));
  if (salePrice === "invalid") {
    return { error: "Sale price must be a positive number" };
  }

  const images = parseImages(formData.get("images"));
  const featured = parseFeatured(formData.get("featured"));

  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        ...parsed.data,
        salePrice,
        featured,
        images: {
          deleteMany: {},
          create: images.map((url, index) => ({
            url,
            altText: parsed.data.name,
            position: index,
          })),
        },
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { error: "A product with that slug or SKU already exists." };
    }
    throw error;
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
  return undefined;
}

export async function toggleFeaturedAction(
  productId: string,
  featured: boolean
): Promise<{ error?: string }> {
  const session = await requireAdminAction();
  if (!session) return { error: "Unauthorized" };

  await prisma.product.update({
    where: { id: productId },
    data: { featured },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
  return {};
}

export async function deleteProductAction(productId: string): Promise<{ error?: string }> {
  const session = await requireAdminAction();
  if (!session) return { error: "Unauthorized" };

  try {
    await prisma.product.delete({ where: { id: productId } });
  } catch (error) {
    if (isForeignKeyRestrictError(error)) {
      return {
        error: "This product can't be deleted because it has existing orders.",
      };
    }
    throw error;
  }

  revalidatePath("/admin/products");
  return {};
}
