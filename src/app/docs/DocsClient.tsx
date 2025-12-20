"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/UI";

type DocChapterId =
  | "get-started"
  | "ecosystem"
  | "usdk"
  | "products"
  | "ktg"
  | "dao"
  | "developers"
  | "safety"
  | "compliance"
  | "faq"
  | "contacts";

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

function DocsClient({ children }: { children?: React.ReactNode }) {
  const sp = useSearchParams();
  const selectedRaw = sp?.get("ch");
  const selected = isValidId(selectedRaw) ? selectedRaw : CHAPTERS[0].id;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:h-[calc(100vh-220px)]">
      <Card className="md:col-span-1 bg-white border-slate-200 md:sticky md:top-6 md:self-start">
        <div className="text-xs font-semibold text-slate-700">Table of Contents</div>
        <div className="mt-3 space-y-1">
          {CHAPTERS.map((c) => {
            const active = c.id === selected;
            return (
              <Link
                key={c.id}
                href={`/docs?ch=${c.id}`}
                className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                  active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {c.title}
              </Link>
            );
          })}
        </div>
      </Card>

      <Card className="md:col-span-3 bg-white border-slate-200 md:overflow-y-auto md:h-full">
        {children}
      </Card>
    </div>
  );
}

export { DocsClient };
export default DocsClient;
