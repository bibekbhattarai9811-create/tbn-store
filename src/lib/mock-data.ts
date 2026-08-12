import type { Category, Product } from "@/types/product";

export const categories: Category[] = [
  { id: "cat-shoes", name: "Shoes", slug: "shoes" },
  { id: "cat-apparel", name: "Apparel", slug: "apparel" },
  { id: "cat-electronics", name: "Electronics", slug: "electronics" },
  { id: "cat-home", name: "Home Goods", slug: "home-goods" },
  { id: "cat-accessories", name: "Accessories", slug: "accessories" },
];

function image(seed: string): { url: string; altText: string } {
  return {
    url: `https://picsum.photos/seed/${seed}/600/600`,
    altText: seed.replace(/-/g, " "),
  };
}

const shoes = categories[0];
const apparel = categories[1];
const electronics = categories[2];
const home = categories[3];
const accessories = categories[4];

export const products: Product[] = [
  {
    id: "prod-1",
    name: "Nike Air Max",
    slug: "nike-air-max",
    description:
      "A cushioned everyday sneaker with a breathable mesh upper and visible Air unit for all-day comfort.",
    price: 129.99,
    salePrice: 99.99,
    sku: "SHOE-AIRMAX-01",
    stock: 24,
    brand: "Nike",
    category: shoes,
    images: [image("nike-air-max-1"), image("nike-air-max-2")],
    rating: 4.6,
    reviewCount: 212,
    createdAt: "2026-06-01",
  },
  {
    id: "prod-2",
    name: "Adidas Ultraboost",
    slug: "adidas-ultraboost",
    description:
      "Responsive Boost midsole with a Primeknit upper built for long runs and daily training.",
    price: 179.99,
    salePrice: null,
    sku: "SHOE-ULTRA-02",
    stock: 4,
    brand: "Adidas",
    category: shoes,
    images: [image("adidas-ultraboost-1")],
    rating: 4.4,
    reviewCount: 158,
    createdAt: "2026-05-20",
  },
  {
    id: "prod-3",
    name: "Classic Leather Loafer",
    slug: "classic-leather-loafer",
    description:
      "Hand-finished full-grain leather loafer with a cushioned footbed and durable rubber sole.",
    price: 149.0,
    salePrice: null,
    sku: "SHOE-LOAF-03",
    stock: 0,
    brand: "Clarks",
    category: shoes,
    images: [image("leather-loafer-1")],
    rating: 4.2,
    reviewCount: 61,
    createdAt: "2026-04-11",
  },
  {
    id: "prod-4",
    name: "Merino Wool Crewneck",
    slug: "merino-wool-crewneck",
    description:
      "Lightweight merino wool sweater that regulates temperature and resists odor on repeat wears.",
    price: 89.0,
    salePrice: 69.0,
    sku: "APP-CREW-01",
    stock: 32,
    brand: "Everlane",
    category: apparel,
    images: [image("merino-crewneck-1")],
    rating: 4.7,
    reviewCount: 94,
    createdAt: "2026-07-02",
  },
  {
    id: "prod-5",
    name: "Relaxed Fit Denim Jacket",
    slug: "relaxed-fit-denim-jacket",
    description:
      "A classic trucker silhouette in rigid denim that breaks in beautifully over time.",
    price: 118.0,
    salePrice: null,
    sku: "APP-DENIM-02",
    stock: 15,
    brand: "Levi's",
    category: apparel,
    images: [image("denim-jacket-1")],
    rating: 4.5,
    reviewCount: 130,
    createdAt: "2026-03-18",
  },
  {
    id: "prod-6",
    name: "Performance Running Tee",
    slug: "performance-running-tee",
    description:
      "Moisture-wicking fabric with flatlock seams to prevent chafing on long runs.",
    price: 34.0,
    salePrice: null,
    sku: "APP-TEE-03",
    stock: 3,
    brand: "Nike",
    category: apparel,
    images: [image("running-tee-1")],
    rating: 4.1,
    reviewCount: 45,
    createdAt: "2026-06-25",
  },
  {
    id: "prod-7",
    name: "Noise Cancelling Headphones",
    slug: "noise-cancelling-headphones",
    description:
      "Over-ear headphones with adaptive noise cancellation and 30-hour battery life.",
    price: 349.0,
    salePrice: 299.0,
    sku: "ELEC-HP-01",
    stock: 18,
    brand: "Sony",
    category: electronics,
    images: [image("headphones-1"), image("headphones-2")],
    rating: 4.8,
    reviewCount: 402,
    createdAt: "2026-07-10",
  },
  {
    id: "prod-8",
    name: "Smart Fitness Watch",
    slug: "smart-fitness-watch",
    description:
      "Track heart rate, sleep, and workouts with a week-long battery and always-on display.",
    price: 249.0,
    salePrice: null,
    sku: "ELEC-WATCH-02",
    stock: 9,
    brand: "Garmin",
    category: electronics,
    images: [image("fitness-watch-1")],
    rating: 4.5,
    reviewCount: 187,
    createdAt: "2026-05-05",
  },
  {
    id: "prod-9",
    name: "Portable Bluetooth Speaker",
    slug: "portable-bluetooth-speaker",
    description:
      "Waterproof speaker with 360-degree sound and 20 hours of playtime on a single charge.",
    price: 79.99,
    salePrice: 59.99,
    sku: "ELEC-SPK-03",
    stock: 0,
    brand: "JBL",
    category: electronics,
    images: [image("bt-speaker-1")],
    rating: 4.3,
    reviewCount: 220,
    createdAt: "2026-02-14",
  },
  {
    id: "prod-10",
    name: "Ceramic Pour-Over Coffee Set",
    slug: "ceramic-pour-over-coffee-set",
    description:
      "Hand-glazed ceramic dripper and carafe set for a cleaner, richer cup of coffee.",
    price: 64.0,
    salePrice: null,
    sku: "HOME-COFFEE-01",
    stock: 21,
    brand: "Fellow",
    category: home,
    images: [image("pour-over-1")],
    rating: 4.6,
    reviewCount: 76,
    createdAt: "2026-04-29",
  },
  {
    id: "prod-11",
    name: "Linen Throw Blanket",
    slug: "linen-throw-blanket",
    description:
      "Pre-washed European linen blanket that gets softer with every wash.",
    price: 98.0,
    salePrice: 78.0,
    sku: "HOME-BLANKET-02",
    stock: 12,
    brand: "Parachute",
    category: home,
    images: [image("linen-blanket-1")],
    rating: 4.4,
    reviewCount: 53,
    createdAt: "2026-01-30",
  },
  {
    id: "prod-12",
    name: "Cast Iron Skillet",
    slug: "cast-iron-skillet",
    description:
      "Pre-seasoned 12-inch skillet built to last generations, safe for oven and induction.",
    price: 54.99,
    salePrice: null,
    sku: "HOME-SKILLET-03",
    stock: 40,
    brand: "Lodge",
    category: home,
    images: [image("cast-iron-1")],
    rating: 4.9,
    reviewCount: 512,
    createdAt: "2026-03-02",
  },
  {
    id: "prod-13",
    name: "Full-Grain Leather Wallet",
    slug: "full-grain-leather-wallet",
    description:
      "Slim bifold wallet in vegetable-tanned leather that develops a rich patina over time.",
    price: 68.0,
    salePrice: null,
    sku: "ACC-WALLET-01",
    stock: 27,
    brand: "Bellroy",
    category: accessories,
    images: [image("leather-wallet-1")],
    rating: 4.7,
    reviewCount: 141,
    createdAt: "2026-06-14",
  },
  {
    id: "prod-14",
    name: "Polarized Aviator Sunglasses",
    slug: "polarized-aviator-sunglasses",
    description:
      "UV400-protected polarized lenses in a lightweight titanium frame.",
    price: 145.0,
    salePrice: 116.0,
    sku: "ACC-SUNGLASSES-02",
    stock: 6,
    brand: "Ray-Ban",
    category: accessories,
    images: [image("aviators-1")],
    rating: 4.5,
    reviewCount: 98,
    createdAt: "2026-05-27",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((product) => product.category.slug === categorySlug);
}

export function getFeaturedProducts(limit = 8): Product[] {
  return [...products]
    .sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount)
    .slice(0, limit);
}
