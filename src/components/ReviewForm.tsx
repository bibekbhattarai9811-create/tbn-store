"use client";

import { useActionState, useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/Button";
import { upsertReviewAction } from "@/app/reviews/actions";

export function ReviewForm({
  productId,
  defaultRating,
  defaultComment,
}: {
  productId: string;
  defaultRating?: number;
  defaultComment?: string | null;
}) {
  const [state, formAction, isPending] = useActionState(upsertReviewAction, undefined);
  const [rating, setRating] = useState(defaultRating ?? 0);
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3 rounded-2xl border border-border-subtle p-4"
    >
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="rating" value={rating} />

      {state?.error && (
        <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">
          {defaultRating ? "Your rating" : "Rate this product"}
        </span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
            >
              <Star
                size={22}
                className={
                  (hoverRating || rating) >= value
                    ? "fill-accent text-accent"
                    : "text-border-subtle"
                }
              />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="comment" className="text-sm font-medium">
          Comment <span className="text-foreground/50">(optional)</span>
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={3}
          defaultValue={defaultComment ?? ""}
          className="rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm outline-none focus:border-foreground"
        />
      </div>

      <Button
        type="submit"
        size="md"
        className="self-start"
        disabled={isPending || rating === 0}
      >
        {isPending ? "Saving..." : defaultRating ? "Update review" : "Submit review"}
      </Button>
    </form>
  );
}
