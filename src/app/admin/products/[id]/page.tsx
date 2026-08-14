import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { updateProductAction, deleteProductAction } from "../actions";
import { getLocale } from "@/i18n/locale";
import { getDictionary } from "@/i18n/dictionaries";
import { tf } from "@/i18n/format";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: (await getDictionary(locale)).admin.products.editTitle };
}

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

  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const p = dict.admin.products;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">{p.editTitle}</h1>
        <ConfirmDeleteButton
          label={p.deleteProduct}
          deletingLabel={dict.common.deleting}
          confirmMessage={tf(p.deleteConfirm, { name: product.name })}
          action={deleteProductAction.bind(null, product.id)}
          redirectTo="/admin/products"
        />
      </div>
      <ProductForm
        action={updateProductAction.bind(null, product.id)}
        categories={categories}
        submitLabel={p.saveChanges}
        dict={{ form: p.form, common: dict.common }}
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
