import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About us",
};

const sectionClasses = "flex flex-col gap-2";
const headingClasses = "text-lg font-semibold tracking-tight";
const bodyClasses = "text-sm leading-relaxed text-foreground/70";

export default function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-16 sm:px-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">About TBN Store</h1>
        <p className="text-sm text-foreground/50">Based in Mahaboudha, Kathmandu</p>
      </div>

      <p className={bodyClasses}>
        TBN Store is a small kids clothing boutique based in Mahaboudha, Kathmandu. We sell
        sweaters, tracksuits, jackets, and matching outfit sets for babies, toddlers, and kids —
        picked for wear and warmth, not just how they photograph.
      </p>

      <div className={sectionClasses}>
        <h2 className={headingClasses}>How we work</h2>
        <p className={bodyClasses}>
          We&apos;re a booking-based shop, not an instant checkout. Browse the catalog, pick a
          size, and submit a booking. We&apos;ll call you on the number you provide to confirm
          stock, sizing, and delivery details before anything ships — so you&apos;re never
          guessing whether an order actually went through.
        </p>
      </div>

      <div className={sectionClasses}>
        <h2 className={headingClasses}>Why booking instead of instant checkout</h2>
        <p className={bodyClasses}>
          Kids&apos; sizing varies a lot between brands and styles. A quick call lets us confirm
          fit against your child&apos;s measurements and current stock before you commit, which
          means fewer wrong-size returns and a person you can actually talk to if something&apos;s
          off.
        </p>
      </div>

      <div className={sectionClasses}>
        <h2 className={headingClasses}>Get in touch</h2>
        <p className={bodyClasses}>
          Questions about a product, an existing booking, or anything else — see our{" "}
          <a href="/contact" className="underline hover:no-underline">
            contact page
          </a>{" "}
          for phone, email, and location details.
        </p>
      </div>
    </div>
  );
}
