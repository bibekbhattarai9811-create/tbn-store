import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireAdminAction } from "@/lib/admin";

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

  try {
    const blob = await put(filename, request.body, {
      access: "public",
      addRandomSuffix: true,
    });
    return NextResponse.json(blob);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 400 },
    );
  }
}
