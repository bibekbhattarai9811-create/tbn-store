import type { Metadata } from "next";
import { getLocale } from "@/i18n/locale";
import { getDictionary } from "@/i18n/dictionaries";
import { ne } from "@/i18n/dictionaries/ne";
import { getTranslationManifest, getByPath, SECTION_LABELS } from "@/i18n/manifest";
import { prisma } from "@/lib/prisma";
import { TranslationsBoard } from "@/components/admin/TranslationsBoard";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: (await getDictionary(locale)).admin.translations.title };
}

export default async function AdminTranslationsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const t = dict.admin.translations;

  const manifest = getTranslationManifest();
  const overrides = await prisma.translation.findMany();
  const overrideMap = new Map(overrides.map((row) => [row.key, row.value]));

  const entries = manifest.map((entry) => {
    const override = overrideMap.get(entry.path);
    const defaultNe = String(getByPath(ne, entry.path) ?? "");
    return {
      path: entry.path,
      en: entry.en,
      section: entry.section,
      sectionLabel: SECTION_LABELS[entry.section] ?? entry.section,
      defaultNe,
      currentNe: override ?? defaultNe,
      isCustomized: override != null,
    };
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t.title}</h1>
        <p className="text-sm text-foreground/60">{t.subtitle}</p>
      </div>
      <TranslationsBoard entries={entries} dict={t} />
    </div>
  );
}
