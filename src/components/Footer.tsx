import Link from "next/link";
import { getCategories } from "@/lib/products";
import { auth } from "@/auth";

export async function Footer() {
  const [categories, session] = await Promise.all([getCategories(), auth()]);
  return (
    <footer className="border-t border-border-subtle bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:grid-cols-4 sm:px-6 lg:px-8">
        <div className="col-span-2 flex flex-col gap-2 sm:col-span-1">
          <span className="text-lg font-semibold tracking-tight">Aurora</span>
          <p className="text-sm text-foreground/60">
            Thoughtfully made goods for everyday life.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Shop</span>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products/${category.slug}`}
              className="text-sm text-foreground/60 hover:text-foreground"
            >
              {category.name}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Account</span>
          {session?.user ? (
            <Link href="/account" className="text-sm text-foreground/60 hover:text-foreground">
              Your account
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm text-foreground/60 hover:text-foreground">
                Sign in
              </Link>
              <Link href="/register" className="text-sm text-foreground/60 hover:text-foreground">
                Create account
              </Link>
            </>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Company</span>
          <span className="text-sm text-foreground/60">About</span>
          <span className="text-sm text-foreground/60">Contact</span>
          <span className="text-sm text-foreground/60">Shipping & Returns</span>
        </div>
      </div>
      <div className="border-t border-border-subtle px-4 py-4 text-center text-xs text-foreground/50 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} Aurora. All rights reserved.
      </div>
    </footer>
  );
}
