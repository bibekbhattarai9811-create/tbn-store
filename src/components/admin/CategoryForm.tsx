"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/Button";
import type { CategoryActionState } from "@/app/admin/categories/actions";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const inputClasses =
  "h-11 rounded-lg border border-border-subtle bg-surface px-3 text-sm outline-none focus:border-foreground";

export function CategoryForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (
    prevState: CategoryActionState,
    formData: FormData
  ) => Promise<CategoryActionState>;
  defaultValues?: { name: string; slug: string };
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState(action, undefined);
  const [name, setName] = useState(defaultValues?.name ?? "");
  const [slug, setSlug] = useState(defaultValues?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(defaultValues));

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4">
      {state?.error && (
        <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
          {state.error}
        </p>
      )}

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

      <Button type="submit" size="lg" className="self-start" disabled={isPending}>
        {isPending ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
