"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { Button, buttonClasses } from "@/components/Button";
import { QuantitySelector } from "@/components/QuantitySelector";
import { placeOrderAction } from "@/app/cart/actions";
import type { Product } from "@/types/product";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

type CartLine = { product: Product; quantity: number };

const TAX_RATE = 0.08;
const SHIPPING_FLAT = 6.99;

export function CartView({
  initialCart,
  isLoggedIn,
}: {
  initialCart: CartLine[];
  isLoggedIn: boolean;
}) {
  const [cart, setCart] = useState<CartLine[]>(initialCart);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateQuantity(productId: string, quantity: number) {
    setCart((lines) =>
      lines.map((line) =>
        line.product.id === productId ? { ...line, quantity } : line
      )
    );
  }

  function removeItem(productId: string) {
    setCart((lines) => lines.filter((line) => line.product.id !== productId));
  }

  function handleCheckout() {
    setError(null);
    startTransition(async () => {
      const result = await placeOrderAction(
        cart.map((line) => ({
          productId: line.product.id,
          quantity: line.quantity,
        }))
      );
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  const subtotal = cart.reduce((sum, line) => {
    const price = line.product.salePrice ?? line.product.price;
    return sum + price * line.quantity;
  }, 0);
  const tax = subtotal * TAX_RATE;
  const shipping = cart.length > 0 ? SHIPPING_FLAT : 0;
  const total = subtotal + tax + shipping;

  if (cart.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold tracking-tight">Your cart is empty</h1>
        <p className="text-sm text-foreground/60">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link href="/products" className={buttonClasses("primary", "lg")}>
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
      <div className="flex flex-col gap-6 lg:col-span-2">
        <h1 className="text-2xl font-semibold tracking-tight">Your cart</h1>
        <ul className="flex flex-col divide-y divide-border-subtle">
          {cart.map((line) => {
            const price = line.product.salePrice ?? line.product.price;
            return (
              <li key={line.product.id} className="flex gap-4 py-5">
                <Link
                  href={`/products/${line.product.slug}`}
                  className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-surface"
                >
                  <Image
                    src={line.product.images[0].url}
                    alt={line.product.images[0].altText}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/products/${line.product.slug}`}
                        className="text-sm font-medium hover:underline"
                      >
                        {line.product.name}
                      </Link>
                      <p className="text-xs text-foreground/50">
                        {line.product.brand}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label="Remove item"
                      onClick={() => removeItem(line.product.id)}
                      className="rounded-full p-1.5 text-foreground/50 hover:bg-surface hover:text-foreground"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <QuantitySelector
                      max={line.product.stock}
                      initialQuantity={line.quantity}
                      onChange={(quantity) => updateQuantity(line.product.id, quantity)}
                    />
                    <span className="text-sm font-semibold">
                      {currencyFormatter.format(price * line.quantity)}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-border-subtle p-6 h-fit">
        <h2 className="text-lg font-semibold">Order summary</h2>
        <dl className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-foreground/60">Subtotal</dt>
            <dd>{currencyFormatter.format(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-foreground/60">Estimated tax</dt>
            <dd>{currencyFormatter.format(tax)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-foreground/60">Shipping</dt>
            <dd>{currencyFormatter.format(shipping)}</dd>
          </div>
          <div className="flex justify-between border-t border-border-subtle pt-2 text-base font-semibold">
            <dt>Total</dt>
            <dd>{currencyFormatter.format(total)}</dd>
          </div>
        </dl>

        {error && (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}

        {isLoggedIn ? (
          <Button size="lg" onClick={handleCheckout} disabled={isPending}>
            {isPending ? "Placing order..." : "Checkout"}
          </Button>
        ) : (
          <Link
            href="/login?callbackUrl=/cart"
            className={buttonClasses("primary", "lg")}
          >
            Sign in to checkout
          </Link>
        )}
      </div>
    </div>
  );
}
