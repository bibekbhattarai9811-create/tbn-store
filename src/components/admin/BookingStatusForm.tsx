"use client";

import { useActionState } from "react";
import { Button } from "@/components/Button";
import type { BookingActionState } from "@/app/admin/bookings/actions";
import type { Dictionary } from "@/i18n/dictionaries";

const statuses = ["PENDING", "CONTACTED", "CONFIRMED", "CANCELLED"] as const;

export function BookingStatusForm({
  action,
  currentStatus,
  dict,
  statusDict,
}: {
  action: (
    prevState: BookingActionState,
    formData: FormData
  ) => Promise<BookingActionState>;
  currentStatus: string;
  dict: {
    bookingStatus: string;
    updateStatus: string;
    updating: string;
  };
  statusDict: Dictionary["bookingStatus"];
}) {
  const [state, formAction, isPending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex items-end gap-3">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="status" className="text-sm font-medium">
          {dict.bookingStatus}
        </label>
        <select
          id="status"
          name="status"
          defaultValue={currentStatus}
          className="h-11 rounded-lg border border-border-subtle bg-surface px-3 text-sm outline-none focus:border-foreground"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {statusDict[status]}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? dict.updating : dict.updateStatus}
      </Button>
      {state?.error && <span className="text-sm text-danger">{state.error}</span>}
    </form>
  );
}
