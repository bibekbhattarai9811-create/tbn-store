"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLocaleAction } from "@/i18n/actions";
import type { Locale } from "@/i18n/locale";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === locale || isPending) return;
    startTransition(async () => {
      await setLocaleAction(next);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-border-subtle p-0.5 text-xs font-medium">
      <button
        type="button"
        onClick={() => switchTo("en")}
        aria-current={locale === "en"}
        className={`rounded-full px-2 py-1 transition-colors ${
          locale === "en" ? "bg-foreground text-background" : "text-foreground/60"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => switchTo("ne")}
        aria-current={locale === "ne"}
        className={`rounded-full px-2 py-1 transition-colors ${
          locale === "ne" ? "bg-foreground text-background" : "text-foreground/60"
        }`}
      >
        नेपाली
      </button>
    </div>
  );
}
