import "server-only";
import { prisma } from "@/lib/prisma";
import { getProductsByIds } from "@/lib/products";

export async function isProductWishlisted(
  userId: string,
  productId: string
): Promise<boolean> {
  const item = await prisma.wishlistItem.findFirst({
    where: { productId, wishlist: { userId } },
    select: { id: true },
  });
  return item != null;
}

export async function getWishlistProducts(userId: string) {
  const wishlist = await prisma.wishlist.findUnique({
    where: { userId },
    include: {
      items: {
        orderBy: { createdAt: "desc" },
        select: { productId: true },
      },
    },
  });

  const ids = wishlist?.items.map((item) => item.productId) ?? [];
  return getProductsByIds(ids);
}
