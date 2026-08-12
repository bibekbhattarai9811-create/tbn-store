"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/validation";

export type ReviewActionState = { error?: string } | undefined;

export async function upsertReviewAction(
  _prevState: ReviewActionState,
  formData: FormData
): Promise<ReviewActionState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "Please sign in to write a review." };
  }

  const parsed = reviewSchema.safeParse({
    productId: formData.get("productId"),
    rating: formData.get("rating"),
    comment: (formData.get("comment") as string) || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const product = await prisma.product.findUnique({
    where: { id: parsed.data.productId },
    select: { slug: true },
  });
  if (!product) {
    return { error: "This product is no longer available." };
  }

  await prisma.review.upsert({
    where: {
      productId_userId: {
        productId: parsed.data.productId,
        userId: session.user.id,
      },
    },
    update: {
      rating: parsed.data.rating,
      comment: parsed.data.comment || null,
    },
    create: {
      productId: parsed.data.productId,
      userId: session.user.id,
      rating: parsed.data.rating,
      comment: parsed.data.comment || null,
    },
  });

  revalidatePath(`/products/${product.slug}`);
  return undefined;
}
