"use client";

import { useActionState } from "react";
import { Button } from "@/components/Button";
import { SingleImageField } from "@/components/admin/SingleImageField";
import type { SettingsActionState } from "@/app/admin/settings/actions";
import type { Dictionary } from "@/i18n/dictionaries";

export function SettingsForm({
  action,
  defaultHeroImageUrl,
  dict,
}: {
  action: (
    prevState: SettingsActionState,
    formData: FormData
  ) => Promise<SettingsActionState>;
  defaultHeroImageUrl: string;
  dict: { settings: Dictionary["admin"]["settings"]; common: Dictionary["common"] };
}) {
  const { settings, common } = dict;
  const [state, formAction, isPending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4">
      {state?.error && (
        <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">
          {settings.saved}
        </p>
      )}

      <SingleImageField
        name="heroImageUrl"
        label={settings.heroImage}
        defaultUrl={defaultHeroImageUrl}
        dict={common}
      />

      <Button type="submit" size="lg" className="self-start" disabled={isPending}>
        {isPending ? common.saving : settings.saveChanges}
      </Button>
    </form>
  );
}
