"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function toggleWishlistAction(
  productId: string
): Promise<{ error?: string; saved?: boolean }> {
  const session = await auth();
  if (!session?.user) {
    return { error: "Please sign in to save items to your wishlist." };
  }

  const wishlist = await prisma.wishlist.upsert({
    where: { userId: session.user.id },
    update: {},
    create: { userId: session.user.id },
  });

  const existing = await prisma.wishlistItem.findUnique({
    where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
  });

  let saved: boolean;
  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    saved = false;
  } else {
    await prisma.wishlistItem.create({ data: { wishlistId: wishlist.id, productId } });
    saved = true;
  }

  revalidatePath("/wishlist");
  return { saved };
}
