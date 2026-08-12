import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function image(seed: string) {
  return {
    url: `https://picsum.photos/seed/${seed}/600/600`,
    altText: seed.replace(/-/g, " "),
  };
}

const categories = [
  { name: "Shoes", slug: "shoes" },
  { name: "Apparel", slug: "apparel" },
  { name: "Electronics", slug: "electronics" },
  { name: "Home Goods", slug: "home-goods" },
  { name: "Accessories", slug: "accessories" },
];

const products = [
  {
    name: "Nike Air Max",
    slug: "nike-air-max",
    description:
      "A cushioned everyday sneaker with a breathable mesh upper and visible Air unit for all-day comfort.",
    price: 129.99,
    salePrice: 99.99,
    sku: "SHOE-AIRMAX-01",
    stock: 24,
    brand: "Nike",
    category: "shoes",
    images: [image("nike-air-max-1"), image("nike-air-max-2")],
  },
  {
    name: "Adidas Ultraboost",
    slug: "adidas-ultraboost",
    description:
      "Responsive Boost midsole with a Primeknit upper built for long runs and daily training.",
    price: 179.99,
    salePrice: null,
    sku: "SHOE-ULTRA-02",
    stock: 4,
    brand: "Adidas",
    category: "shoes",
    images: [image("adidas-ultraboost-1")],
  },
  {
    name: "Classic Leather Loafer",
    slug: "classic-leather-loafer",
    description:
      "Hand-finished full-grain leather loafer with a cushioned footbed and durable rubber sole.",
    price: 149.0,
    salePrice: null,
    sku: "SHOE-LOAF-03",
    stock: 0,
    brand: "Clarks",
    category: "shoes",
    images: [image("leather-loafer-1")],
  },
  {
    name: "Merino Wool Crewneck",
    slug: "merino-wool-crewneck",
    description:
      "Lightweight merino wool sweater that regulates temperature and resists odor on repeat wears.",
    price: 89.0,
    salePrice: 69.0,
    sku: "APP-CREW-01",
    stock: 32,
    brand: "Everlane",
    category: "apparel",
    images: [image("merino-crewneck-1")],
  },
  {
    name: "Relaxed Fit Denim Jacket",
    slug: "relaxed-fit-denim-jacket",
    description:
      "A classic trucker silhouette in rigid denim that breaks in beautifully over time.",
    price: 118.0,
    salePrice: null,
    sku: "APP-DENIM-02",
    stock: 15,
    brand: "Levi's",
    category: "apparel",
    images: [image("denim-jacket-1")],
  },
  {
    name: "Performance Running Tee",
    slug: "performance-running-tee",
    description:
      "Moisture-wicking fabric with flatlock seams to prevent chafing on long runs.",
    price: 34.0,
    salePrice: null,
    sku: "APP-TEE-03",
    stock: 3,
    brand: "Nike",
    category: "apparel",
    images: [image("running-tee-1")],
  },
  {
    name: "Noise Cancelling Headphones",
    slug: "noise-cancelling-headphones",
    description:
      "Over-ear headphones with adaptive noise cancellation and 30-hour battery life.",
    price: 349.0,
    salePrice: 299.0,
    sku: "ELEC-HP-01",
    stock: 18,
    brand: "Sony",
    category: "electronics",
    images: [image("headphones-1"), image("headphones-2")],
  },
  {
    name: "Smart Fitness Watch",
    slug: "smart-fitness-watch",
    description:
      "Track heart rate, sleep, and workouts with a week-long battery and always-on display.",
    price: 249.0,
    salePrice: null,
    sku: "ELEC-WATCH-02",
    stock: 9,
    brand: "Garmin",
    category: "electronics",
    images: [image("fitness-watch-1")],
  },
  {
    name: "Portable Bluetooth Speaker",
    slug: "portable-bluetooth-speaker",
    description:
      "Waterproof speaker with 360-degree sound and 20 hours of playtime on a single charge.",
    price: 79.99,
    salePrice: 59.99,
    sku: "ELEC-SPK-03",
    stock: 0,
    brand: "JBL",
    category: "electronics",
    images: [image("bt-speaker-1")],
  },
  {
    name: "Ceramic Pour-Over Coffee Set",
    slug: "ceramic-pour-over-coffee-set",
    description:
      "Hand-glazed ceramic dripper and carafe set for a cleaner, richer cup of coffee.",
    price: 64.0,
    salePrice: null,
    sku: "HOME-COFFEE-01",
    stock: 21,
    brand: "Fellow",
    category: "home-goods",
    images: [image("pour-over-1")],
  },
  {
    name: "Linen Throw Blanket",
    slug: "linen-throw-blanket",
    description: "Pre-washed European linen blanket that gets softer with every wash.",
    price: 98.0,
    salePrice: 78.0,
    sku: "HOME-BLANKET-02",
    stock: 12,
    brand: "Parachute",
    category: "home-goods",
    images: [image("linen-blanket-1")],
  },
  {
    name: "Cast Iron Skillet",
    slug: "cast-iron-skillet",
    description:
      "Pre-seasoned 12-inch skillet built to last generations, safe for oven and induction.",
    price: 54.99,
    salePrice: null,
    sku: "HOME-SKILLET-03",
    stock: 40,
    brand: "Lodge",
    category: "home-goods",
    images: [image("cast-iron-1")],
  },
  {
    name: "Full-Grain Leather Wallet",
    slug: "full-grain-leather-wallet",
    description:
      "Slim bifold wallet in vegetable-tanned leather that develops a rich patina over time.",
    price: 68.0,
    salePrice: null,
    sku: "ACC-WALLET-01",
    stock: 27,
    brand: "Bellroy",
    category: "accessories",
    images: [image("leather-wallet-1")],
  },
  {
    name: "Polarized Aviator Sunglasses",
    slug: "polarized-aviator-sunglasses",
    description: "UV400-protected polarized lenses in a lightweight titanium frame.",
    price: 145.0,
    salePrice: 116.0,
    sku: "ACC-SUNGLASSES-02",
    stock: 6,
    brand: "Ray-Ban",
    category: "accessories",
    images: [image("aviators-1")],
  },
];

const demoUsers = [
  { name: "Aurora Admin", email: "admin@aurora.test", role: "ADMIN" as const },
  { name: "Alice Nguyen", email: "alice@aurora.test", role: "CUSTOMER" as const },
  { name: "Bob Martinez", email: "bob@aurora.test", role: "CUSTOMER" as const },
  { name: "Carla Silva", email: "carla@aurora.test", role: "CUSTOMER" as const },
];

const reviewComments = [
  "Exactly as described, would buy again.",
  "Good quality for the price.",
  "Shipped fast and works great.",
  "Not bad, but sizing runs a little small.",
  "Exceeded my expectations, highly recommend.",
  "Solid everyday item.",
];

async function main() {
  const categoryIdBySlug = new Map<string, string>();
  for (const category of categories) {
    const record = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });
    categoryIdBySlug.set(category.slug, record.id);
  }

  const productIds: string[] = [];
  for (const product of products) {
    const categoryId = categoryIdBySlug.get(product.category);
    if (!categoryId) throw new Error(`Unknown category: ${product.category}`);

    const record = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        salePrice: product.salePrice,
        stock: product.stock,
        brand: product.brand,
        categoryId,
      },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        salePrice: product.salePrice,
        sku: product.sku,
        stock: product.stock,
        brand: product.brand,
        categoryId,
        images: {
          create: product.images.map((img, index) => ({
            url: img.url,
            altText: img.altText,
            position: index,
          })),
        },
      },
    });
    productIds.push(record.id);
  }

  const devPassword = await bcrypt.hash("Passw0rd!", 10);
  const userIds: string[] = [];
  for (const user of demoUsers) {
    const record = await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, role: user.role },
      create: {
        name: user.name,
        email: user.email,
        role: user.role,
        passwordHash: devPassword,
      },
    });
    userIds.push(record.id);
  }

  const [, ...customerIds] = userIds;
  let reviewCount = 0;
  for (let i = 0; i < productIds.length; i++) {
    const productId = productIds[i];
    const reviewerCount = 1 + (i % 3);
    for (let r = 0; r < reviewerCount; r++) {
      const userId = customerIds[r % customerIds.length];
      const rating = 3 + ((i + r) % 3);
      await prisma.review.upsert({
        where: { productId_userId: { productId, userId } },
        update: {},
        create: {
          productId,
          userId,
          rating,
          comment: reviewComments[(i + r) % reviewComments.length],
        },
      });
      reviewCount++;
    }
  }

  console.log(
    `Seeded ${categories.length} categories, ${products.length} products, ${demoUsers.length} users, ${reviewCount} reviews.`
  );
  console.log(
    `Dev login (all seeded users): password "Passw0rd!" — change before production.`
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
