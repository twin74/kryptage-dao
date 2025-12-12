import React from "react";

export function PageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h1>
        {subtitle ? <p className="mt-2 text-sm text-slate-300">{subtitle}</p> : null}
      </div>
      {children}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`rounded-xl border border-slate-800 bg-slate-900/40 p-6 ${className}`}>{children}</div>;
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "green" | "amber" | "red" | "blue";
}) {
  const map: Record<string, string> = {
    neutral: "border-slate-700 bg-slate-900/40 text-slate-200",
    green: "border-emerald-800 bg-emerald-950/40 text-emerald-200",
    amber: "border-amber-800 bg-amber-950/40 text-amber-200",
    red: "border-red-800 bg-red-950/40 text-red-200",
    blue: "border-blue-800 bg-blue-950/40 text-blue-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${map[tone] || map.neutral}`}>
      {children}
    </span>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  className = "",
  type,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type || "button"}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
  disabled,
  className = "",
  type,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type || "button"}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md border border-slate-700 bg-slate-950/30 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-900 disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}
