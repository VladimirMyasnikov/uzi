"use client";

import { useMemo, useState } from "react";

const FALLBACK_IMG = "https://via.placeholder.com/900x540?text=Нет+изображения";
const FALLBACK_THUMB = "https://via.placeholder.com/160x120?text=Нет+превью";

type Props = {
  images: string[];
  alt: string;
};

export function ProductGallery({ images, alt }: Props) {
  const normalized = useMemo(() => {
    return (images || [])
      .filter(Boolean)
      .map((src) => {
        if (src.startsWith("http")) return src;
        if (src.startsWith("/")) return src;
        return FALLBACK_IMG;
      })
      .filter((src, idx, arr) => arr.indexOf(src) === idx)
      .slice(0, 6);
  }, [images]);

  const hasImages = normalized.length > 0;
  const [current, setCurrent] = useState(0);
  const ordered = hasImages ? normalized : [];

  if (!hasImages) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm text-slate-500">
        Изображения уточняются
      </div>
    );
  }

  const mainSrc = ordered[current] || ordered[0];

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <img
          src={mainSrc}
          alt={alt}
          className="h-full w-full object-contain bg-white"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_IMG;
          }}
        />
      </div>
      {ordered.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {ordered.map((src, idx) => (
            <button
              key={src + idx}
              onClick={() => setCurrent(idx)}
              className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border ${
                idx === current ? "border-slate-900" : "border-slate-200"
              } bg-white`}
            >
              <img
                src={src}
                alt={`${alt} превью ${idx + 1}`}
                className="h-full w-full object-contain"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_THUMB;
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

