"use client";

import React, { useEffect, useId, useMemo, useState } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  loading?: "eager" | "lazy";
};

export default function ZoomImage({ src, alt, className = "", wrapperClassName = "", loading = "lazy" }: Props) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Prevent background scrolling when the modal is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const ariaLabel = useMemo(() => (alt?.trim() ? alt : "Zoomed image"), [alt]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`group relative block w-full cursor-zoom-in overflow-hidden rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/20 ${wrapperClassName}`}
        aria-label={`Open image: ${ariaLabel}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className={`h-auto w-full transition-transform duration-200 group-hover:scale-[1.01] ${className}`}
          loading={loading}
        />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={() => setOpen(false)}
        >
          <div className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <div id={titleId} className="truncate text-sm font-semibold text-white">
                {ariaLabel}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
              >
                Close
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={alt} className="h-auto w-full" />
            </div>

            <div className="mt-3 text-center text-xs text-white/70">Tap outside the image or press Esc to close.</div>
          </div>
        </div>
      )}
    </>
  );
}
