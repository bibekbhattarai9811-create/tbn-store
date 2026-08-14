import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { updateProductAction, deleteProductAction } from "../actions";

export const metadata: Metadata = {
  title: "Edit product",
};

export default async function EditProductPage(
  props: PageProps<"/admin/products/[id]">
) {
  const { id } = await props.params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { position: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Edit product</h1>
        <ConfirmDeleteButton
          label="Delete product"
          confirmMessage={`Delete "${product.name}"? This can't be undone.`}
          action={deleteProductAction.bind(null, product.id)}
          redirectTo="/admin/products"
        />
      </div>
      <ProductForm
        action={updateProductAction.bind(null, product.id)}
        categories={categories}
        submitLabel="Save changes"
        defaultValues={{
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price.toNumber(),
          salePrice: product.salePrice ? product.salePrice.toNumber() : null,
          sku: product.sku,
          stock: product.stock,
          brand: product.brand,
          categoryId: product.categoryId,
          featured: product.featured,
          images: product.images.map((image) => image.url),
          sizes: product.sizes,
        }}
      />
    </div>
  );
}
