"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export function ProductFilters({
  resultLabel,
  dict,
}: {
  resultLabel: string;
  dict: {
    searchPlaceholder: string;
    sortFeatured: string;
    sortPriceAsc: string;
    sortPriceDesc: string;
    sortRating: string;
    sortNewest: string;
  };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sortOptions = [
    { value: "featured", label: dict.sortFeatured },
    { value: "price-asc", label: dict.sortPriceAsc },
    { value: "price-desc", label: dict.sortPriceDesc },
    { value: "rating", label: dict.sortRating },
    { value: "newest", label: dict.sortNewest },
  ];

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 rounded-full border border-border-subtle bg-surface px-3 py-2 sm:max-w-xs">
        <Search size={16} className="text-foreground/50" />
        <input
          type="search"
          placeholder={dict.searchPlaceholder}
          defaultValue={searchParams.get("q") ?? ""}
          onChange={(event) => updateParam("q", event.target.value)}
          className="w-full bg-transparent text-sm outline-none placeholder:text-foreground/40"
        />
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-foreground/60">{resultLabel}</span>
        <select
          value={searchParams.get("sort") ?? "featured"}
          onChange={(event) => updateParam("sort", event.target.value)}
          className="rounded-full border border-border-subtle bg-surface px-3 py-2 text-sm outline-none"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
