"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { toggleFeaturedAction } from "@/app/admin/products/actions";

export function FeaturedToggle({
  productId,
  initialFeatured,
  markLabel,
  removeLabel,
}: {
  productId: string;
  initialFeatured: boolean;
  markLabel: string;
  removeLabel: string;
}) {
  const [featured, setFeatured] = useState(initialFeatured);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    const next = !featured;
    setFeatured(next);
    startTransition(async () => {
      const result = await toggleFeaturedAction(productId, next);
      if (result?.error) {
        setFeatured(!next);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={featured ? removeLabel : markLabel}
      aria-pressed={featured}
      className="rounded-full p-1.5 hover:bg-surface disabled:opacity-50"
    >
      <Star
        size={16}
        className={featured ? "fill-accent text-accent" : "text-foreground/30"}
      />
    </button>
  );
}
