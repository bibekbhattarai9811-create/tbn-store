"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function ConfirmDeleteButton({
  action,
  confirmMessage,
  label = "Delete",
  redirectTo,
}: {
  action: () => Promise<{ error?: string } | undefined>;
  confirmMessage: string;
  label?: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(confirmMessage)) return;
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (result?.error) {
        setError(result.error);
      } else if (redirectTo) {
        router.push(redirectTo);
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-danger hover:bg-danger/10 disabled:opacity-50"
      >
        <Trash2 size={14} />
        {isPending ? "Deleting..." : label}
      </button>
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
}
