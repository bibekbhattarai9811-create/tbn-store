import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Returns",
};

const sectionClasses = "flex flex-col gap-2";
const headingClasses = "text-lg font-semibold tracking-tight";
const bodyClasses = "text-sm leading-relaxed text-foreground/70";

export default function ShippingReturnsPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-16 sm:px-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Shipping & Returns</h1>
      </div>

      <div className={sectionClasses}>
        <h2 className={headingClasses}>How delivery works</h2>
        <p className={bodyClasses}>
          We don&apos;t charge or ship automatically at checkout. When you submit a booking, we
          call you to confirm the item, size, and your delivery address, then arrange delivery
          from there. Delivery within the Kathmandu Valley is typically handled within a few days
          of confirmation; outside the valley, timing depends on the courier and destination and
          we&apos;ll give you an estimate on the call.
        </p>
      </div>

      <div className={sectionClasses}>
        <h2 className={headingClasses}>Payment</h2>
        <p className={bodyClasses}>
          Payment is arranged when we confirm your booking by phone — we&apos;ll walk you through
          the options available for your order at that time.
        </p>
      </div>

      <div className={sectionClasses}>
        <h2 className={headingClasses}>Returns and exchanges</h2>
        <p className={bodyClasses}>
          Because we confirm sizing with you by phone before an item ships, mis-orders are rare.
          If an item arrives damaged or isn&apos;t what was confirmed on the call, contact us
          within 3 days of delivery and we&apos;ll sort out a replacement or refund. Items must be
          unworn and in their original condition.
        </p>
      </div>

      <div className={sectionClasses}>
        <h2 className={headingClasses}>Questions</h2>
        <p className={bodyClasses}>
          For anything about an existing booking or delivery, see our{" "}
          <a href="/contact" className="underline hover:no-underline">
            contact page
          </a>{" "}
          to reach us by phone or email.
        </p>
      </div>
    </div>
  );
}
