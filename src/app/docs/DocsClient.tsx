"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Badge, Card } from "@/components/UI";
import { DocContentPart1, type DocChapterIdPart1 } from "./DocContentPart1";
import { DocContentPart2, type DocChapterIdPart2 } from "./DocContentPart2";

type DocChapterId = DocChapterIdPart1 | DocChapterIdPart2;

type Chapter = {
  id: DocChapterId;
  title: string;
};

const CHAPTERS: Chapter[] = [
  { id: "get-started", title: "1) Get Started" },
  { id: "ecosystem", title: "2) Ecosystem" },
  { id: "usdk", title: "3) USDK Stablecoin" },
  { id: "products", title: "4) Products" },
  { id: "ktg", title: "5) $KTG Token" },
  { id: "dao", title: "6) Kryptage DAO" },
  { id: "developers", title: "7) Developers" },
  { id: "safety", title: "8) Safety & Risk" },
  { id: "compliance", title: "9) Compliance & Legal" },
  { id: "faq", title: "10) FAQ" },
  { id: "contacts", title: "11) Contacts & Links" },
];

function isValidId(id: string | null): id is DocChapterId {
  return !!id && CHAPTERS.some((c) => c.id === id);
}

function getHashChapter(): DocChapterId {
  if (typeof window === "undefined") return CHAPTERS[0].id;
  const raw = (window.location.hash || "").replace(/^#/, "");
  return isValidId(raw) ? raw : CHAPTERS[0].id;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-8 text-xl font-semibold text-slate-900">{children}</h2>;
}

function P({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`mt-3 text-sm leading-6 text-slate-700 ${className}`}>{children}</p>;
}

function Li({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <li className={`mt-2 text-sm leading-6 text-slate-700 ${className}`}>{children}</li>;
}

function isPart1(id: DocChapterId): id is DocChapterIdPart1 {
  return id === "get-started" || id === "ecosystem" || id === "usdk" || id === "products" || id === "ktg";
}

function DocContent({ chapter }: { chapter: DocChapterId }) {
  if (isPart1(chapter)) {
    return <DocContentPart1 chapter={chapter} SectionTitle={SectionTitle} P={P} Li={Li} />;
  }

  return <DocContentPart2 chapter={chapter} SectionTitle={SectionTitle} P={P} Li={Li} />;
}

export default function DocsClient() {
  const [selected, setSelected] = useState<DocChapterId>(CHAPTERS[0].id);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const update = () => setSelected(getHashChapter());
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  useEffect(() => {
    // Ensure that changing chapter always starts from the top (desktop + mobile).
    // Desktop: scroll the content panel; Mobile: scroll the page.
    // Use rAF so the scroll happens after the new content is committed.
    requestAnimationFrame(() => {
      contentRef.current?.scrollTo({ top: 0, behavior: "auto" });
      window.scrollTo({ top: 0, behavior: "auto" });
    });
  }, [selected]);

  useEffect(() => {
    // When navigating via in-content anchors (e.g. end-of-chapter CTA), browsers may try
    // to preserve scroll position. Force a top reset on hash changes as well.
    const onHash = () => {
      requestAnimationFrame(() => {
        contentRef.current?.scrollTo({ top: 0, behavior: "auto" });
        window.scrollTo({ top: 0, behavior: "auto" });
      });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:h-[calc(100vh-220px)]">
      {/* Mobile TOC */}
      <Card className="md:hidden bg-white border-slate-200">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-slate-700">Table of Contents</div>
            <div className="mt-1 text-xs text-slate-500">Select a section</div>
          </div>

          <select
            value={selected}
            onChange={(e) => {
              const next = e.target.value as DocChapterId;
              setSelected(next);
              if (typeof window !== "undefined") window.location.hash = `#${next}`;
            }}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
            aria-label="Select documentation section"
          >
            {CHAPTERS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Desktop TOC (unchanged) */}
      <Card className="hidden md:block md:col-span-1 bg-white border-slate-200 md:sticky md:top-6 md:self-start">
        <div className="text-xs font-semibold text-slate-700">Table of Contents</div>
        <div className="mt-3 space-y-1">
          {CHAPTERS.map((c) => {
            const active = c.id === selected;
            return (
              <a
                key={c.id}
                href={`#${c.id}`}
                className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                  active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {c.title}
              </a>
            );
          })}
        </div>
      </Card>

      <Card className="md:col-span-3 bg-white border-slate-200 md:overflow-y-auto md:h-full">
        <div ref={contentRef} className="h-full overflow-y-auto p-6">
          <DocContent chapter={selected} />
        </div>
      </Card>
    </div>
  );
}
