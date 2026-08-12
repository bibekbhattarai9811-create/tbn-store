"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/Button";
import { ProductImagesField } from "@/components/admin/ProductImagesField";
import type { ProductActionState } from "@/app/admin/products/actions";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const inputClasses =
  "h-11 rounded-lg border border-border-subtle bg-surface px-3 text-sm outline-none focus:border-foreground";

type ProductFormValues = {
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice: number | null;
  sku: string;
  stock: number;
  brand: string | null;
  categoryId: string;
  featured: boolean;
  images: string[];
};

export function ProductForm({
  action,
  categories,
  defaultValues,
  submitLabel,
}: {
  action: (
    prevState: ProductActionState,
    formData: FormData
  ) => Promise<ProductActionState>;
  categories: { id: string; name: string }[];
  defaultValues?: ProductFormValues;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState(action, undefined);
  const [name, setName] = useState(defaultValues?.name ?? "");
  const [slug, setSlug] = useState(defaultValues?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(defaultValues));

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state?.error && (
        <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
          {state.error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (!slugEdited) setSlug(slugify(event.target.value));
            }}
            className={inputClasses}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="slug" className="text-sm font-medium">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            required
            value={slug}
            onChange={(event) => {
              setSlugEdited(true);
              setSlug(event.target.value);
            }}
            className={inputClasses}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          defaultValue={defaultValues?.description}
          className="rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm outline-none focus:border-foreground"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="price" className="text-sm font-medium">
            Price (Rs)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={defaultValues?.price}
            className={inputClasses}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="salePrice" className="text-sm font-medium">
            Sale price (Rs)
          </label>
          <input
            id="salePrice"
            name="salePrice"
            type="number"
            step="0.01"
            min="0"
            defaultValue={defaultValues?.salePrice ?? ""}
            className={inputClasses}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="stock" className="text-sm font-medium">
            Stock
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            required
            defaultValue={defaultValues?.stock}
            className={inputClasses}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="sku" className="text-sm font-medium">
            SKU
          </label>
          <input
            id="sku"
            name="sku"
            required
            defaultValue={defaultValues?.sku}
            className={inputClasses}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="brand" className="text-sm font-medium">
            Brand
          </label>
          <input
            id="brand"
            name="brand"
            defaultValue={defaultValues?.brand ?? ""}
            className={inputClasses}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="categoryId" className="text-sm font-medium">
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={defaultValues?.categoryId ?? ""}
            className={inputClasses}
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label className="flex w-fit items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={defaultValues?.featured}
          className="h-4 w-4 rounded border-border-subtle accent-accent"
        />
        Featured on homepage
      </label>

      <ProductImagesField defaultImages={defaultValues?.images} />

      <Button type="submit" size="lg" className="self-start" disabled={isPending}>
        {isPending ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
