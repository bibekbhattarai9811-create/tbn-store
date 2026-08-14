"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/Button";
import { ProductImagesField } from "@/components/admin/ProductImagesField";
import type { ProductActionState } from "@/app/admin/products/actions";
import type { Dictionary } from "@/i18n/dictionaries";

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
  costPrice: number | null;
  sku: string;
  stock: number;
  brand: string | null;
  categoryId: string;
  featured: boolean;
  images: string[];
  sizes: string[];
};

export function ProductForm({
  action,
  categories,
  defaultValues,
  submitLabel,
  dict,
}: {
  action: (
    prevState: ProductActionState,
    formData: FormData
  ) => Promise<ProductActionState>;
  categories: { id: string; name: string }[];
  defaultValues?: ProductFormValues;
  submitLabel: string;
  dict: Pick<Dictionary["admin"]["products"], "form"> & { common: Dictionary["common"] };
}) {
  const { form, common } = dict;
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
            {form.name}
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
            {form.slug}
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
          {form.description}
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
            {form.price}
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
            {form.salePrice}
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
            {form.stock}
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
            {form.sku}
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
            {form.brand}
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
            {form.category}
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={defaultValues?.categoryId ?? ""}
            className={inputClasses}
          >
            <option value="" disabled>
              {form.selectCategory}
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 rounded-lg border border-dashed border-border-subtle p-3">
        <label htmlFor="costPrice" className="text-sm font-medium">
          {form.costPrice}
        </label>
        <input
          id="costPrice"
          name="costPrice"
          type="number"
          step="0.01"
          min="0"
          defaultValue={defaultValues?.costPrice ?? ""}
          className={`${inputClasses} max-w-xs`}
        />
        <p className="text-xs text-foreground/50">{form.costPriceHint}</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="sizes" className="text-sm font-medium">
          {form.sizes}
        </label>
        <input
          id="sizes"
          name="sizes"
          placeholder={form.sizesPlaceholder}
          defaultValue={defaultValues?.sizes.join(", ") ?? ""}
          className={inputClasses}
        />
        <p className="text-xs text-foreground/50">{form.sizesHint}</p>
      </div>

      <label className="flex w-fit items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={defaultValues?.featured}
          className="h-4 w-4 rounded border-border-subtle accent-accent"
        />
        {form.featured}
      </label>

      <ProductImagesField defaultImages={defaultValues?.images} dict={common} />

      <Button type="submit" size="lg" className="self-start" disabled={isPending}>
        {isPending ? common.saving : submitLabel}
      </Button>
    </form>
  );
}
