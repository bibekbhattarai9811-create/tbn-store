"use client";

import { useRef, useState } from "react";
import type { PutBlobResult } from "@vercel/blob";
import { Plus, Upload, X } from "lucide-react";

export function ProductImagesField({
  defaultImages = [],
}: {
  defaultImages?: string[];
}) {
  const [urls, setUrls] = useState<string[]>(
    defaultImages.length ? defaultImages : [""]
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function updateUrl(index: number, value: string) {
    setUrls((prev) => prev.map((url, i) => (i === index ? value : url)));
  }

  function removeAt(index: number) {
    setUrls((prev) => prev.filter((_, i) => i !== index));
  }

  function addRow() {
    setUrls((prev) => [...prev, ""]);
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    try {
      const response = await fetch(
        `/api/admin/upload?filename=${encodeURIComponent(file.name)}`,
        { method: "POST", body: file },
      );
      const data = (await response.json()) as PutBlobResult | { error: string };
      if (!response.ok || "error" in data) {
        throw new Error("error" in data ? data.error : "Upload failed");
      }
      setUrls((prev) => [...prev.filter((url) => url.trim() !== ""), data.url]);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  const serialized = urls
    .map((url) => url.trim())
    .filter(Boolean)
    .join("\n");

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium">Images</span>
      <input type="hidden" name="images" value={serialized} />

      <div className="flex flex-col gap-2">
        {urls.map((url, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface">
              {url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={url}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.visibility = "hidden";
                  }}
                />
              )}
            </div>
            <input
              type="url"
              value={url}
              onChange={(event) => updateUrl(index, event.target.value)}
              placeholder="https://example.com/image.jpg"
              className="h-10 flex-1 rounded-lg border border-border-subtle bg-surface px-3 text-sm outline-none focus:border-foreground"
            />
            <button
              type="button"
              onClick={() => removeAt(index)}
              aria-label="Remove image"
              className="rounded-full p-2 text-foreground/50 hover:bg-surface hover:text-danger"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        {urls.length === 0 && (
          <p className="text-xs text-foreground/50">No images yet.</p>
        )}
      </div>

      {uploadError && <p className="text-xs text-danger">{uploadError}</p>}

      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex w-fit items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-sm text-background hover:opacity-90 disabled:opacity-50"
        >
          <Upload size={14} />
          {isUploading ? "Uploading..." : "Upload photo"}
        </button>
        <button
          type="button"
          onClick={addRow}
          className="flex w-fit items-center gap-1.5 rounded-full border border-border-subtle px-3 py-1.5 text-sm hover:bg-surface"
        >
          <Plus size={14} />
          Add image URL
        </button>
      </div>
    </div>
  );
}
