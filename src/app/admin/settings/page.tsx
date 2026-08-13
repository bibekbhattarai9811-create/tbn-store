import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { updateSiteSettingsAction } from "./actions";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-foreground/60">
          Manage the homepage hero banner image.
        </p>
      </div>
      <SettingsForm
        action={updateSiteSettingsAction}
        defaultHeroImageUrl={settings?.heroImageUrl ?? ""}
      />
    </div>
  );
}
