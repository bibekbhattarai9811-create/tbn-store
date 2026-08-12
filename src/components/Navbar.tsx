import { getCategories } from "@/lib/products";
import { NavbarClient } from "@/components/NavbarClient";

export async function Navbar() {
  const categories = await getCategories();
  return <NavbarClient categories={categories} />;
}
