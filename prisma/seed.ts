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
  { name: "Dresses", slug: "dresses" },
  { name: "Hoodies & Sweatshirts", slug: "hoodies-sweatshirts" },
  { name: "T-Shirts & Tops", slug: "t-shirts-tops" },
  { name: "Outerwear & Jackets", slug: "outerwear-jackets" },
  { name: "Bottoms", slug: "bottoms" },
];

const products = [
  {
    name: "Floral Ruffle Party Dress",
    slug: "floral-ruffle-party-dress",
    description:
      "Twirl-ready party dress with ruffled sleeves and a soft cotton-blend lining, perfect for birthdays and special occasions.",
    price: 34.99,
    salePrice: 27.99,
    sku: "DRESS-FLORAL-01",
    stock: 18,
    brand: "Little Bloom",
    category: "dresses",
    images: [image("floral-ruffle-dress-1"), image("floral-ruffle-dress-2")],
  },
  {
    name: "Cotton Sundress",
    slug: "cotton-sundress",
    description:
      "Breathable everyday sundress with an adjustable tie waist, perfect for warm-weather play.",
    price: 24.99,
    salePrice: null,
    sku: "DRESS-SUN-02",
    stock: 22,
    brand: "Sunny Days",
    category: "dresses",
    images: [image("cotton-sundress-1")],
  },
  {
    name: "Tulle Princess Dress",
    slug: "tulle-princess-dress",
    description:
      "Layered tulle skirt with a sparkly bodice for dress-up days and special events.",
    price: 39.99,
    salePrice: 32.99,
    sku: "DRESS-TULLE-03",
    stock: 5,
    brand: "Buttercup Kids",
    category: "dresses",
    images: [image("tulle-princess-dress-1")],
  },
  {
    name: "Fleece Pullover Hoodie",
    slug: "fleece-pullover-hoodie",
    description:
      "Cozy brushed fleece hoodie with a kangaroo pocket and ribbed cuffs for all-day comfort.",
    price: 28.99,
    salePrice: null,
    sku: "HOOD-FLEECE-01",
    stock: 30,
    brand: "Cub & Co.",
    category: "hoodies-sweatshirts",
    images: [image("fleece-pullover-hoodie-1")],
  },
  {
    name: "Sherpa Zip-Up Hoodie",
    slug: "sherpa-zip-up-hoodie",
    description:
      "Soft sherpa lining and a full-zip front make this the go-to layer for cooler days.",
    price: 32.99,
    salePrice: 26.99,
    sku: "HOOD-SHERPA-02",
    stock: 14,
    brand: "TinyTrek",
    category: "hoodies-sweatshirts",
    images: [image("sherpa-zip-hoodie-1")],
  },
  {
    name: "Graphic Crewneck Sweatshirt",
    slug: "graphic-crewneck-sweatshirt",
    description:
      "Playful printed crewneck in soft cotton fleece, machine washable and built to last through play.",
    price: 22.99,
    salePrice: null,
    sku: "HOOD-CREW-03",
    stock: 0,
    brand: "Wanderling",
    category: "hoodies-sweatshirts",
    images: [image("graphic-crewneck-1")],
  },
  {
    name: "Organic Cotton Tee 3-Pack",
    slug: "organic-cotton-tee-3-pack",
    description:
      "Three everyday essential tees in soft organic cotton, tagless for sensitive skin.",
    price: 19.99,
    salePrice: null,
    sku: "TEE-3PACK-01",
    stock: 40,
    brand: "Pebble Kids",
    category: "t-shirts-tops",
    images: [image("organic-cotton-tee-1")],
  },
  {
    name: "Long-Sleeve Striped Top",
    slug: "long-sleeve-striped-top",
    description:
      "Classic striped long-sleeve top in a lightweight cotton jersey, easy to layer.",
    price: 16.99,
    salePrice: null,
    sku: "TEE-STRIPE-02",
    stock: 25,
    brand: "Maple & Moss",
    category: "t-shirts-tops",
    images: [image("striped-top-1")],
  },
  {
    name: "Unicorn Print T-Shirt",
    slug: "unicorn-print-t-shirt",
    description:
      "Soft cotton tee with a glittery unicorn print, a playroom favorite.",
    price: 14.99,
    salePrice: 11.99,
    sku: "TEE-UNICORN-03",
    stock: 8,
    brand: "Little Bloom",
    category: "t-shirts-tops",
    images: [image("unicorn-print-tee-1")],
  },
  {
    name: "Puffer Winter Jacket",
    slug: "puffer-winter-jacket",
    description:
      "Lightweight insulated puffer with a water-resistant shell to keep little ones warm all winter.",
    price: 44.99,
    salePrice: null,
    sku: "JACK-PUFFER-01",
    stock: 12,
    brand: "TinyTrek",
    category: "outerwear-jackets",
    images: [image("puffer-winter-jacket-1")],
  },
  {
    name: "Denim Jacket",
    slug: "kids-denim-jacket",
    description:
      "A timeless denim jacket with button cuffs, easy to layer over any outfit.",
    price: 29.99,
    salePrice: 23.99,
    sku: "JACK-DENIM-02",
    stock: 16,
    brand: "Wanderling",
    category: "outerwear-jackets",
    images: [image("kids-denim-jacket-1")],
  },
  {
    name: "Rain Shell Jacket",
    slug: "rain-shell-jacket",
    description:
      "Packable waterproof shell with a snug hood, ready for puddle-jumping adventures.",
    price: 27.99,
    salePrice: null,
    sku: "JACK-RAIN-03",
    stock: 3,
    brand: "Puddle Jumpers",
    category: "outerwear-jackets",
    images: [image("rain-shell-jacket-1")],
  },
  {
    name: "Jogger Pants",
    slug: "jogger-pants",
    description:
      "Relaxed-fit joggers with an elastic waistband, built for climbing, running, and everything in between.",
    price: 21.99,
    salePrice: null,
    sku: "BTM-JOGGER-01",
    stock: 28,
    brand: "Cub & Co.",
    category: "bottoms",
    images: [image("jogger-pants-1")],
  },
  {
    name: "Leggings 2-Pack",
    slug: "leggings-2-pack",
    description:
      "Stretchy, soft leggings in a two-pack, perfect under dresses or on their own.",
    price: 17.99,
    salePrice: 14.99,
    sku: "BTM-LEGGING-02",
    stock: 20,
    brand: "Cloud Nine Kids",
    category: "bottoms",
    images: [image("leggings-2-pack-1")],
  },
];

const demoUsers = [
  { name: "TBN Admin", email: "admin@tbnstore.test", role: "ADMIN" as const },
  { name: "Alice Nguyen", email: "alice@tbnstore.test", role: "CUSTOMER" as const },
  { name: "Bob Martinez", email: "bob@tbnstore.test", role: "CUSTOMER" as const },
  { name: "Carla Silva", email: "carla@tbnstore.test", role: "CUSTOMER" as const },
];

const reviewComments = [
  "Exactly as described, would buy again.",
  "Great quality fabric, held up well after washing.",
  "Shipped fast and fits true to size.",
  "Cute print, but sizing runs a little small.",
  "Exceeded my expectations, highly recommend.",
  "My kid refuses to take it off, solid pick.",
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
