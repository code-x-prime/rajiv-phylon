"use client";

import { useState } from "react";
import Image from "next/image";

export function ProductGallery({ images, productName }) {
  const [selected, setSelected] = useState(0);
  const list = images?.length ? images : [];

  if (list.length === 0) {
    return (
      <div className="aspect-square bg-[#f8fafc] border border-[#e5e7eb] flex items-center justify-center text-[#6b7280]">
        No image
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="aspect-square relative bg-[#f8fafc] border border-[#e5e7eb] overflow-hidden">
        <Image
          src={list[selected]?.url}
          alt={productName}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
      {list.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {list.slice(0, 4).map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              className={`aspect-square relative bg-[#f8fafc] border overflow-hidden ${selected === i ? "border-[hsl(var(--accent))]" : "border-[#e5e7eb]"}`}
            >
              <Image src={img.url} alt={`${productName} ${i + 1}`} fill className="object-cover" sizes="120px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
