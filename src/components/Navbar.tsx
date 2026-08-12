import { getCategories } from "@/lib/products";
import { auth } from "@/auth";
import { NavbarClient } from "@/components/NavbarClient";

export async function Navbar() {
  const [categories, session] = await Promise.all([getCategories(), auth()]);
  return <NavbarClient categories={categories} user={session?.user ?? null} />;
}
