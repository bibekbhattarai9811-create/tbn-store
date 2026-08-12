"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

export function ProductImagesField({
  defaultImages = [],
}: {
  defaultImages?: string[];
}) {
  const [urls, setUrls] = useState<string[]>(
    defaultImages.length ? defaultImages : [""]
  );

  function updateUrl(index: number, value: string) {
    setUrls((prev) => prev.map((url, i) => (i === index ? value : url)));
  }

  function removeAt(index: number) {
    setUrls((prev) => prev.filter((_, i) => i !== index));
  }

  function addRow() {
    setUrls((prev) => [...prev, ""]);
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

      <button
        type="button"
        onClick={addRow}
        className="flex w-fit items-center gap-1.5 rounded-full border border-border-subtle px-3 py-1.5 text-sm hover:bg-surface"
      >
        <Plus size={14} />
        Add image
      </button>
    </div>
  );
}
