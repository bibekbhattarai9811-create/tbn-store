import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { deleteReviewAction } from "./actions";

export const metadata: Metadata = {
  title: "Reviews",
};

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      product: { select: { name: true, slug: true } },
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Reviews</h1>

      <div className="overflow-x-auto rounded-2xl border border-border-subtle">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border-subtle bg-surface text-xs uppercase text-foreground/50">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Comment</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {reviews.map((review) => (
              <tr key={review.id}>
                <td className="px-4 py-3">
                  <Link
                    href={`/products/${review.product.slug}`}
                    className="font-medium hover:underline"
                  >
                    {review.product.name}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span>{review.user.name}</span>
                    <span className="text-xs text-foreground/50">
                      {review.user.email}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">{review.rating} / 5</td>
                <td className="max-w-xs px-4 py-3 text-foreground/70">
                  {review.comment ?? (
                    <span className="text-foreground/40">No comment</span>
                  )}
                </td>
                <td className="px-4 py-3 text-foreground/60">
                  {review.createdAt.toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <ConfirmDeleteButton
                      confirmMessage={`Delete this review from ${review.user.name}?`}
                      action={deleteReviewAction.bind(null, review.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-foreground/60">
                  No reviews yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
