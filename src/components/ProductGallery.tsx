"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/types/product";

export function ProductGallery({ images }: { images: ProductImage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface">
        {active && (
          <Image
            src={active.url}
            alt={active.altText}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
            className="object-cover"
          />
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-square w-20 overflow-hidden rounded-xl border ${
                index === activeIndex
                  ? "border-foreground"
                  : "border-border-subtle"
              }`}
            >
              <Image
                src={image.url}
                alt={image.altText}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
