"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleWishlistAction } from "@/app/wishlist/actions";

export function WishlistButton({
  productId,
  initialSaved,
  isLoggedIn,
  callbackUrl,
}: {
  productId: string;
  initialSaved: boolean;
  isLoggedIn: boolean;
  callbackUrl: string;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  if (!isLoggedIn) {
    return (
      <Link
        href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
        aria-label="Sign in to save to wishlist"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-border-subtle hover:bg-surface"
      >
        <Heart size={18} className="text-foreground/60" />
      </Link>
    );
  }

  function handleClick() {
    const next = !saved;
    setSaved(next);
    startTransition(async () => {
      const result = await toggleWishlistAction(productId);
      if (result?.saved != null) {
        setSaved(result.saved);
      } else if (result?.error) {
        setSaved(!next);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      aria-pressed={saved}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-border-subtle hover:bg-surface disabled:opacity-50"
    >
      <Heart
        size={18}
        className={saved ? "fill-accent text-accent" : "text-foreground/60"}
      />
    </button>
  );
}
