"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const orderItemsSchema = z
  .array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().positive(),
    })
  )
  .min(1, "Your cart is empty");

export type PlaceOrderState = { error?: string } | undefined;

class StockError extends Error {}

export async function placeOrderAction(
  items: { productId: string; quantity: number }[]
): Promise<PlaceOrderState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "Please sign in to check out." };
  }

  const parsed = orderItemsSchema.safeParse(items);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid cart" };
  }

  let orderId: string;
  try {
    const order = await prisma.$transaction(async (tx) => {
      let total = 0;
      const orderItemsData: { productId: string; quantity: number; price: number }[] =
        [];

      for (const item of parsed.data) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });
        if (!product) {
          throw new StockError("One of the items in your cart is no longer available.");
        }

        const decrementResult = await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (decrementResult.count === 0) {
          throw new StockError(
            `Not enough stock for "${product.name}" (only ${product.stock} left).`
          );
        }

        const unitPrice = (product.salePrice ?? product.price).toNumber();
        total += unitPrice * item.quantity;
        orderItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          price: unitPrice,
        });
      }

      return tx.order.create({
        data: {
          userId: session.user.id,
          totalAmount: total,
          status: "PAID",
          paymentStatus: "SUCCEEDED",
          items: { create: orderItemsData },
        },
      });
    });
    orderId = order.id;
  } catch (error) {
    if (error instanceof StockError) {
      return { error: error.message };
    }
    throw error;
  }

  redirect(`/orders/${orderId}`);
}
