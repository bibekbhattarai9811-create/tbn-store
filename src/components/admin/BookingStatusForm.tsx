"use client";

import { useActionState } from "react";
import { Button } from "@/components/Button";
import type { BookingActionState } from "@/app/admin/bookings/actions";

const statuses = ["PENDING", "CONTACTED", "CONFIRMED", "CANCELLED"] as const;

export function BookingStatusForm({
  action,
  currentStatus,
}: {
  action: (
    prevState: BookingActionState,
    formData: FormData
  ) => Promise<BookingActionState>;
  currentStatus: string;
}) {
  const [state, formAction, isPending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex items-end gap-3">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="status" className="text-sm font-medium">
          Booking status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={currentStatus}
          className="h-11 rounded-lg border border-border-subtle bg-surface px-3 text-sm outline-none focus:border-foreground"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Updating..." : "Update status"}
      </Button>
      {state?.error && <span className="text-sm text-danger">{state.error}</span>}
    </form>
  );
}
