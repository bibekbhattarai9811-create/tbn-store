"use server";

import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function deleteReviewAction(reviewId: string): Promise<{ error?: string }> {
  const session = await requireAdminAction();
  if (!session) return { error: "Unauthorized" };

  await prisma.review.delete({ where: { id: reviewId } });

  revalidatePath("/admin/reviews");
  return {};
}
