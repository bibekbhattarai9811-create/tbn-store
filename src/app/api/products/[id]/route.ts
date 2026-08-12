import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/lib/products";

export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/products/[id]">
) {
  const { id } = await ctx.params;
  const product = await getProductById(id);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ product });
}
