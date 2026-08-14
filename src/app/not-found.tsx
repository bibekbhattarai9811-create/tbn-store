import Link from "next/link";
import { buttonClasses } from "@/components/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center sm:px-6">
      <p className="text-sm font-medium text-foreground/50">404</p>
      <h1 className="text-2xl font-semibold tracking-tight">
        We couldn&apos;t find that page
      </h1>
      <p className="max-w-sm text-sm text-foreground/60">
        The page you&apos;re looking for may have moved or the link might be
        out of date. Try heading back to the shop.
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className={buttonClasses("primary", "md")}>
          Go to homepage
        </Link>
        <Link href="/products" className={buttonClasses("outline", "md")}>
          Browse products
        </Link>
      </div>
    </div>
  );
}
