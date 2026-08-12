"use client";

import { useActionState, useState } from "react";
import { createBookingAction } from "@/app/bookings/actions";
import { Button } from "@/components/Button";
import { QuantitySelector } from "@/components/QuantitySelector";

const inputClasses =
  "h-11 rounded-lg border border-border-subtle bg-surface px-3 text-sm outline-none focus:border-foreground";

export function BookingForm({
  productId,
  defaultName,
  defaultEmail,
}: {
  productId: string;
  defaultName?: string;
  defaultEmail?: string;
}) {
  const [state, formAction, isPending] = useActionState(createBookingAction, undefined);
  const [showForm, setShowForm] = useState(false);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <QuantitySelector max={99} onChange={setQuantity} />
        {!showForm && (
          <Button size="lg" className="flex-1" onClick={() => setShowForm(true)}>
            Book this product
          </Button>
        )}
      </div>

      {showForm && (
        <form
          action={formAction}
          className="flex flex-col gap-4 rounded-2xl border border-border-subtle p-4"
        >
          <input type="hidden" name="productId" value={productId} />
          <input type="hidden" name="quantity" value={quantity} />

          {state?.error && (
            <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
              {state.error}
            </p>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="fullName" className="text-sm font-medium">
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              required
              defaultValue={defaultName}
              className={inputClasses}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="phone" className="text-sm font-medium">
              Contact number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              className={inputClasses}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email <span className="text-foreground/50">(optional)</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              defaultValue={defaultEmail}
              className={inputClasses}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="address" className="text-sm font-medium">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              required
              rows={2}
              className="rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm outline-none focus:border-foreground"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="shopName" className="text-sm font-medium">
              Shop name <span className="text-foreground/50">(optional)</span>
            </label>
            <input id="shopName" name="shopName" className={inputClasses} />
          </div>

          <Button type="submit" size="lg" disabled={isPending}>
            {isPending ? "Submitting..." : "Submit booking request"}
          </Button>
        </form>
      )}
    </div>
  );
}
