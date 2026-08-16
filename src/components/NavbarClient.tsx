"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Heart, LayoutDashboard, LogOut, Menu, Search, User, X } from "lucide-react";
import type { Category } from "@/types/product";
import { signOutAction } from "@/app/actions";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { Locale } from "@/i18n/locale";
import type { Dictionary } from "@/i18n/dictionaries";

type SessionUser = {
  name?: string | null;
  email?: string | null;
  role?: "CUSTOMER" | "HELPER" | "ADMIN";
} | null;

export function NavbarClient({
  categories,
  user,
  locale,
  dict,
}: {
  categories: Category[];
  user: SessionUser;
  locale: Locale;
  dict: Dictionary["nav"];
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/logo.png"
              alt="TBN Store"
              width={1254}
              height={1254}
              sizes="56px"
              priority
              className="h-14 w-14 object-contain"
            />
          </Link>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <Link href="/products" className="hover:text-foreground/70">
              {dict.shop}
            </Link>
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category.id}
                href={`/products/${category.slug}`}
                className="hover:text-foreground/70"
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>

        <form
          action="/products"
          className="hidden flex-1 max-w-sm items-center gap-2 rounded-full border border-border-subtle bg-surface px-3 py-1.5 sm:flex"
        >
          <Search size={16} className="text-foreground/50" />
          <input
            type="search"
            name="q"
            placeholder={dict.searchPlaceholder}
            className="w-full bg-transparent text-sm outline-none placeholder:text-foreground/40"
          />
        </form>

        <div className="hidden sm:block">
          <LanguageSwitcher locale={locale} />
        </div>

        <div className="flex items-center gap-1">
          {user ? (
            <div className="flex items-center gap-1">
              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm hover:bg-surface sm:flex"
                >
                  <LayoutDashboard size={16} />
                  {dict.admin}
                </Link>
              )}
              {user.role === "HELPER" && (
                <Link
                  href="/helper"
                  className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm hover:bg-surface sm:flex"
                >
                  <LayoutDashboard size={16} />
                  {dict.priceCheck}
                </Link>
              )}
              <Link
                href="/wishlist"
                aria-label={dict.wishlist}
                className="rounded-full p-2 hover:bg-surface"
              >
                <Heart size={20} />
              </Link>
              <Link
                href="/account"
                className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm hover:bg-surface sm:flex"
              >
                <User size={16} />
                {user.name?.split(" ")[0] ?? dict.account}
              </Link>
              <form action={signOutAction}>
                <button
                  type="submit"
                  aria-label={dict.signOut}
                  className="rounded-full p-2 hover:bg-surface"
                >
                  <LogOut size={20} />
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              aria-label={dict.signIn}
              className="rounded-full p-2 hover:bg-surface"
            >
              <User size={20} />
            </Link>
          )}
          <button
            type="button"
            aria-label={dict.toggleMenu}
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-full p-2 hover:bg-surface md:hidden"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-border-subtle px-4 py-3 md:hidden">
          <form
            action="/products"
            className="mb-2 flex items-center gap-2 rounded-full border border-border-subtle bg-surface px-3 py-1.5 sm:hidden"
          >
            <Search size={16} className="text-foreground/50" />
            <input
              type="search"
              name="q"
              placeholder={dict.searchPlaceholder}
              className="w-full bg-transparent text-sm outline-none placeholder:text-foreground/40"
            />
          </form>

          <div className="mb-1 sm:hidden">
            <LanguageSwitcher locale={locale} />
          </div>

          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-surface sm:hidden"
              onClick={() => setMenuOpen(false)}
            >
              <LayoutDashboard size={16} />
              {dict.admin}
            </Link>
          )}

          {user?.role === "HELPER" && (
            <Link
              href="/helper"
              className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-surface sm:hidden"
              onClick={() => setMenuOpen(false)}
            >
              <LayoutDashboard size={16} />
              {dict.priceCheck}
            </Link>
          )}

          {user && (
            <Link
              href="/account"
              className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-surface sm:hidden"
              onClick={() => setMenuOpen(false)}
            >
              <User size={16} />
              {user.name?.split(" ")[0] ?? dict.account}
            </Link>
          )}

          <Link
            href="/products"
            className="rounded-lg px-2 py-2 text-sm hover:bg-surface"
            onClick={() => setMenuOpen(false)}
          >
            {dict.shop}
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products/${category.slug}`}
              className="rounded-lg px-2 py-2 text-sm hover:bg-surface"
              onClick={() => setMenuOpen(false)}
            >
              {category.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
