import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { updateSiteSettingsAction } from "./actions";
import { getLocale } from "@/i18n/locale";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: (await getDictionary(locale)).admin.settings.title };
}

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const s = dict.admin.settings;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{s.title}</h1>
        <p className="text-sm text-foreground/60">{s.subtitle}</p>
      </div>
      <SettingsForm
        action={updateSiteSettingsAction}
        defaultHeroImageUrl={settings?.heroImageUrl ?? ""}
        dict={{ settings: s, common: dict.common }}
      />
    </div>
  );
}
