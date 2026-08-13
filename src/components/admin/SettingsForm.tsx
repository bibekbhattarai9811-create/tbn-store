"use client";

import { useActionState } from "react";
import { Button } from "@/components/Button";
import { SingleImageField } from "@/components/admin/SingleImageField";
import type { SettingsActionState } from "@/app/admin/settings/actions";

export function SettingsForm({
  action,
  defaultHeroImageUrl,
}: {
  action: (
    prevState: SettingsActionState,
    formData: FormData
  ) => Promise<SettingsActionState>;
  defaultHeroImageUrl: string;
}) {
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
          Saved.
        </p>
      )}

      <SingleImageField
        name="heroImageUrl"
        label="Hero banner image"
        defaultUrl={defaultHeroImageUrl}
      />

      <Button type="submit" size="lg" className="self-start" disabled={isPending}>
        {isPending ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
