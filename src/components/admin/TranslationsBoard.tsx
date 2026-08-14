"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { TranslationRow } from "@/components/admin/TranslationRow";

export type TranslationBoardEntry = {
  path: string;
  en: string;
  section: string;
  sectionLabel: string;
  defaultNe: string;
  currentNe: string;
  isCustomized: boolean;
};

export function TranslationsBoard({
  entries,
  dict,
}: {
  entries: TranslationBoardEntry[];
  dict: {
    searchPlaceholder: string;
    english: string;
    nepali: string;
    save: string;
    saved: string;
    reset: string;
    customized: string;
    noResults: string;
  };
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      (entry) =>
        entry.en.toLowerCase().includes(q) ||
        entry.currentNe.toLowerCase().includes(q) ||
        entry.path.toLowerCase().includes(q) ||
        entry.sectionLabel.toLowerCase().includes(q)
    );
  }, [entries, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, TranslationBoardEntry[]>();
    for (const entry of filtered) {
      const list = map.get(entry.sectionLabel) ?? [];
      list.push(entry);
      map.set(entry.sectionLabel, list);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 rounded-full border border-border-subtle bg-surface px-3 py-2 sm:max-w-sm">
        <Search size={16} className="text-foreground/50" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={dict.searchPlaceholder}
          className="w-full bg-transparent text-sm outline-none placeholder:text-foreground/40"
        />
      </div>

      {grouped.length === 0 ? (
        <p className="rounded-2xl border border-border-subtle px-4 py-8 text-center text-sm text-foreground/60">
          {dict.noResults}
        </p>
      ) : (
        grouped.map(([sectionLabel, sectionEntries]) => (
          <details key={sectionLabel} open className="rounded-2xl border border-border-subtle p-4">
            <summary className="cursor-pointer text-sm font-semibold tracking-tight">
              {sectionLabel}{" "}
              <span className="font-normal text-foreground/40">({sectionEntries.length})</span>
            </summary>
            <div className="mt-3 flex flex-col">
              {sectionEntries.map((entry) => (
                <TranslationRow
                  key={entry.path}
                  path={entry.path}
                  en={entry.en}
                  defaultNe={entry.defaultNe}
                  initialValue={entry.currentNe}
                  initialCustomized={entry.isCustomized}
                  dict={dict}
                />
              ))}
            </div>
          </details>
        ))
      )}
    </div>
  );
}
