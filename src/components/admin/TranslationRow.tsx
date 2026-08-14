"use client";

import { useState, useTransition } from "react";
import { RotateCcw } from "lucide-react";
import { updateTranslationAction, resetTranslationAction } from "@/i18n/actions";

export function TranslationRow({
  path,
  en,
  defaultNe,
  initialValue,
  initialCustomized,
  dict,
}: {
  path: string;
  en: string;
  defaultNe: string;
  initialValue: string;
  initialCustomized: boolean;
  dict: {
    english: string;
    nepali: string;
    save: string;
    saved: string;
    reset: string;
    customized: string;
  };
}) {
  const [value, setValue] = useState(initialValue);
  const [savedValue, setSavedValue] = useState(initialValue);
  const [customized, setCustomized] = useState(initialCustomized);
  const [isPending, startTransition] = useTransition();
  const [justSaved, setJustSaved] = useState(false);

  const dirty = value !== savedValue;

  function handleSave() {
    startTransition(async () => {
      const result = await updateTranslationAction(path, value);
      if (!result.error) {
        setSavedValue(value);
        setCustomized(value.trim() !== "" && value.trim() !== defaultNe.trim());
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 1500);
      }
    });
  }

  function handleReset() {
    startTransition(async () => {
      const result = await resetTranslationAction(path);
      if (!result.error) {
        setValue(defaultNe);
        setSavedValue(defaultNe);
        setCustomized(false);
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 1500);
      }
    });
  }

  return (
    <div className="grid grid-cols-1 gap-3 border-b border-border-subtle py-4 last:border-b-0 sm:grid-cols-2">
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-mono text-foreground/40">{path}</span>
        <p className="text-sm text-foreground/70">{en}</p>
      </div>
      <div className="flex flex-col gap-2">
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          rows={Math.min(4, Math.max(1, Math.ceil(value.length / 40)))}
          className="rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm outline-none focus:border-foreground"
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={!dirty || isPending}
            className="rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background hover:opacity-90 disabled:opacity-40"
          >
            {justSaved && !dirty ? dict.saved : dict.save}
          </button>
          {customized && (
            <button
              type="button"
              onClick={handleReset}
              disabled={isPending}
              className="flex items-center gap-1 rounded-full border border-border-subtle px-3 py-1 text-xs text-foreground/60 hover:bg-surface disabled:opacity-40"
            >
              <RotateCcw size={12} />
              {dict.reset}
            </button>
          )}
          {customized && (
            <span className="text-[11px] font-medium text-accent">{dict.customized}</span>
          )}
        </div>
      </div>
    </div>
  );
}
