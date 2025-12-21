"use client";

import React, { useEffect, useId, useMemo, useState } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  loading?: "lazy" | "eager";
};

export default function ZoomableImage({ src, alt, className = "", wrapperClassName = "", loading = "lazy" }: Props) {
  const dialogId = useId();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const describedBy = useMemo(() => `${dialogId}-desc`, [dialogId]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`group relative inline-block w-fit max-w-full cursor-zoom-in overflow-hidden rounded-xl ${wrapperClassName}`}
        aria-haspopup="dialog"
        aria-controls={dialogId}
        aria-label={`Open image: ${alt}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className={className} loading={loading} />

        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-slate-200" />
        <div className="pointer-events-none absolute inset-0 rounded-xl bg-black/0 transition-colors group-hover:bg-black/5" />
        <div className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-white/90 px-2 py-1 text-[11px] font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 opacity-0 transition-opacity group-hover:opacity-100">
          Click to zoom
        </div>
      </button>

      {open && (
        <div
          id={dialogId}
          role="dialog"
          aria-modal="true"
          aria-describedby={describedBy}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} aria-hidden="true" />

          <div className="relative z-10 max-h-[90vh] w-full max-w-6xl">
            <p id={describedBy} className="sr-only">
              Zoomed image. Press Escape or click outside the image to close.
            </p>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute -top-3 -right-3 rounded-full bg-white p-2 text-slate-900 shadow ring-1 ring-slate-200"
              aria-label="Close"
            >
              <span className="text-base leading-none">×</span>
            </button>

            <div className="overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-slate-200">
              <div className="max-h-[90vh] overflow-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={alt} className="h-auto w-full" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
