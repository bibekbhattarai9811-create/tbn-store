import { CartView } from "@/components/CartView";
import { getFeaturedProducts } from "@/lib/products";

export default async function CartPage() {
  const products = await getFeaturedProducts(2);
  const initialCart = products.map((product, index) => ({
    product,
    quantity: index === 0 ? 1 : 2,
  }));

  return <CartView initialCart={initialCart} />;
}
