"use client";

import { useRef, useState } from "react";
import type { PutBlobResult } from "@vercel/blob";
import { Upload, X } from "lucide-react";

export function SingleImageField({
  name,
  label,
  defaultUrl = "",
}: {
  name: string;
  label: string;
  defaultUrl?: string;
}) {
  const [url, setUrl] = useState(defaultUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setUrl(data.url);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium">{label}</span>
      <input type="hidden" name={name} value={url} />

      <div className="flex items-center gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface">
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
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://example.com/image.jpg"
          className="h-10 flex-1 rounded-lg border border-border-subtle bg-surface px-3 text-sm outline-none focus:border-foreground"
        />
        {url && (
          <button
            type="button"
            onClick={() => setUrl("")}
            aria-label="Remove image"
            className="rounded-full p-2 text-foreground/50 hover:bg-surface hover:text-danger"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {uploadError && <p className="text-xs text-danger">{uploadError}</p>}

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
    </div>
  );
}
