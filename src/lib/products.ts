import "server-only";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import type { Product } from "@/types/product";

const productInclude = {
  category: true,
  images: { orderBy: { position: "asc" as const } },
  reviews: { select: { rating: true } },
} satisfies Prisma.ProductInclude;

type ProductWithRelations = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

function toProduct(record: ProductWithRelations): Product {
  const reviewCount = record.reviews.length;
  const avgRating = reviewCount
    ? record.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
    : null;

  return {
    id: record.id,
    name: record.name,
    slug: record.slug,
    description: record.description,
    price: record.price.toNumber(),
    salePrice: record.salePrice ? record.salePrice.toNumber() : null,
    sku: record.sku,
    stock: record.stock,
    brand: record.brand,
    category: {
      id: record.category.id,
      name: record.category.name,
      slug: record.category.slug,
    },
    images: record.images.map((image) => ({
      url: image.url,
      altText: image.altText ?? record.name,
    })),
    avgRating,
    reviewCount,
    createdAt: record.createdAt,
  };
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function getProducts(params?: {
  q?: string;
  categorySlug?: string;
}): Promise<Product[]> {
  const { q, categorySlug } = params ?? {};

  const records = await prisma.product.findMany({
    where: {
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { brand: { contains: q, mode: "insensitive" } },
              { category: { name: { contains: q, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    include: productInclude,
    orderBy: { createdAt: "desc" },
  });

  return records.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const record = await prisma.product.findUnique({
    where: { slug },
    include: productInclude,
  });
  return record ? toProduct(record) : null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const record = await prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });
  return record ? toProduct(record) : null;
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const products = await getProducts();
  return [...products]
    .sort((a, b) => (b.avgRating ?? 0) * b.reviewCount - (a.avgRating ?? 0) * a.reviewCount)
    .slice(0, limit);
}
