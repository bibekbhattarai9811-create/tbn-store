import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import { createProductAction } from "../actions";

export const metadata: Metadata = {
  title: "Add product",
};

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Add product</h1>
      <ProductForm
        action={createProductAction}
        categories={categories}
        submitLabel="Create product"
      />
    </div>
  );
}
