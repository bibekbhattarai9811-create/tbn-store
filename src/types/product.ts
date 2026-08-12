export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type ProductImage = {
  url: string;
  altText: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice: number | null;
  sku: string;
  stock: number;
  brand: string;
  category: Category;
  images: ProductImage[];
  rating: number;
  reviewCount: number;
  createdAt: string;
};

export type StockState = "in-stock" | "low-stock" | "out-of-stock";

export function getStockState(stock: number): StockState {
  if (stock <= 0) return "out-of-stock";
  if (stock <= 5) return "low-stock";
  return "in-stock";
}
