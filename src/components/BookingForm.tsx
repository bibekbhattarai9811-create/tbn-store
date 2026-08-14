"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { createBookingAction } from "@/app/bookings/actions";
import { Button } from "@/components/Button";
import { QuantitySelector } from "@/components/QuantitySelector";
import type { Dictionary } from "@/i18n/dictionaries";

const inputClasses =
  "h-11 rounded-lg border border-border-subtle bg-surface px-3 text-sm outline-none focus:border-foreground";

type BookingDict = {
  bookThisProduct: string;
  size: string;
  selectSize: string;
  fullName: string;
  contactNumber: string;
  email: string;
  address: string;
  shopName: string;
  submit: string;
  submitting: string;
  privacyPrefix: string;
  privacyLinkLabel: string;
};

export function BookingForm({
  productId,
  sizes,
  defaultName,
  defaultEmail,
  dict,
  productDict,
  optionalLabel,
}: {
  productId: string;
  sizes: string[];
  defaultName?: string;
  defaultEmail?: string;
  dict: BookingDict;
  productDict: Dictionary["product"];
  optionalLabel: string;
}) {
  const [state, formAction, isPending] = useActionState(createBookingAction, undefined);
  const [showForm, setShowForm] = useState(false);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <QuantitySelector max={99} onChange={setQuantity} dict={productDict} />
        {!showForm && (
          <Button size="lg" className="flex-1" onClick={() => setShowForm(true)}>
            {dict.bookThisProduct}
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

          {sizes.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="size" className="text-sm font-medium">
                {dict.size}
              </label>
              <select
                id="size"
                name="size"
                required
                defaultValue=""
                className={inputClasses}
              >
                <option value="" disabled>
                  {dict.selectSize}
                </option>
                {sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="fullName" className="text-sm font-medium">
              {dict.fullName}
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
              {dict.contactNumber}
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
              {dict.email} <span className="text-foreground/50">{optionalLabel}</span>
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
              {dict.address}
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
              {dict.shopName} <span className="text-foreground/50">{optionalLabel}</span>
            </label>
            <input id="shopName" name="shopName" className={inputClasses} />
          </div>

          <Button type="submit" size="lg" disabled={isPending}>
            {isPending ? dict.submitting : dict.submit}
          </Button>

          <p className="text-xs text-foreground/50">
            {dict.privacyPrefix}{" "}
            <Link href="/privacy" className="underline hover:text-foreground">
              {dict.privacyLinkLabel}
            </Link>
            .
          </p>
        </form>
      )}
    </div>
  );
}
