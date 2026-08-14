import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireAdminAction } from "@/lib/admin";

const ALLOWED_CONTENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8MB

export async function POST(request: Request): Promise<NextResponse> {
  const session = await requireAdminAction();
  if (!session) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");
  if (!filename || !request.body) {
    return NextResponse.json({ error: "Missing filename or file" }, { status: 400 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WebP, and GIF images are allowed." },
      { status: 400 },
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "Image must be under 8MB." }, { status: 400 });
  }

  try {
    const blob = await put(filename, request.body, {
      access: "public",
      addRandomSuffix: true,
      contentType,
    });
    return NextResponse.json(blob);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 400 },
    );
  }
}
