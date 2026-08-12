import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/products";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q") ?? undefined;
  const category = searchParams.get("category") ?? undefined;

  const products = await getProducts({ q, categorySlug: category });
  return NextResponse.json({ products });
}
