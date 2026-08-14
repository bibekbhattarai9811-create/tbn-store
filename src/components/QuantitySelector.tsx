"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";

export function QuantitySelector({
  max,
  initialQuantity = 1,
  onChange,
  dict,
}: {
  max: number;
  initialQuantity?: number;
  onChange?: (quantity: number) => void;
  dict: Dictionary["product"];
}) {
  const [quantity, setQuantity] = useState(initialQuantity);

  function update(next: number) {
    const clamped = Math.min(Math.max(next, 1), Math.max(max, 1));
    setQuantity(clamped);
    onChange?.(clamped);
  }

  return (
    <div className="flex items-center rounded-full border border-border-subtle">
      <button
        type="button"
        aria-label={dict.decreaseQty}
        onClick={() => update(quantity - 1)}
        disabled={quantity <= 1}
        className="flex h-10 w-10 items-center justify-center rounded-full disabled:opacity-30"
      >
        <Minus size={16} />
      </button>
      <span className="w-8 text-center text-sm font-medium">{quantity}</span>
      <button
        type="button"
        aria-label={dict.increaseQty}
        onClick={() => update(quantity + 1)}
        disabled={quantity >= max}
        className="flex h-10 w-10 items-center justify-center rounded-full disabled:opacity-30"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
