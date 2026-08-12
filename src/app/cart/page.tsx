import { CartView } from "@/components/CartView";
import { getFeaturedProducts } from "@/lib/products";
import { auth } from "@/auth";

export default async function CartPage() {
  const [products, session] = await Promise.all([
    getFeaturedProducts(2),
    auth(),
  ]);
  const initialCart = products.map((product, index) => ({
    product,
    quantity: index === 0 ? 1 : 2,
  }));

  return <CartView initialCart={initialCart} isLoggedIn={!!session?.user} />;
}
