import React from "react";

function kGradient(id: string, from: string, to: string) {
  return (
    <defs>
      <linearGradient id={id} x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor={from} />
        <stop offset="100%" stopColor={to} />
      </linearGradient>
    </defs>
  );
}

function KtgMark({ stroke = "currentColor" }: { stroke?: string }) {
  return (
    <>
      <polygon points="60,7 108,35 108,85 60,113 12,85 12,35" fill="#0f172a" stroke={stroke} strokeWidth="7" />
      <path d="M42 30 v60 M42 60 l40 -30 M42 60 l40 30" stroke={stroke} strokeWidth="10" strokeLinecap="round" fill="none" />
    </>
  );
}

export function UsdkIcon({ className = "" }: { className?: string }) {
  const gid = "usdk-g";
  return (
    <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="USDK">
      {kGradient(gid, "#22c55e", "#166534")}
      <KtgMark stroke={`url(#${gid})`} />
    </svg>
  );
}

export function SusdkIcon({ className = "" }: { className?: string }) {
  const gid = "susdk-g";
  return (
    <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="sUSDK">
      {kGradient(gid, "#facc15", "#a16207")}
      <KtgMark stroke={`url(#${gid})`} />
    </svg>
  );
}

export function KtgIcon({ className = "" }: { className?: string }) {
  const gid = "ktg-g";
  return (
    <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="KTG">
      {kGradient(gid, "#38bdf8", "#1d4ed8")}
      {/* slightly wider mark so it doesn't look smaller than other token icons */}
      <polygon points="60,6 109,35 109,85 60,114 11,85 11,35" fill="#0f172a" stroke={`url(#${gid})`} strokeWidth="8" />
      <path d="M40 30 v60 M40 60 l42 -30 M40 60 l42 30" stroke={`url(#${gid})`} strokeWidth="11" strokeLinecap="round" fill="none" />
    </svg>
  );
}
