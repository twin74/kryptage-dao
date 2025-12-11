import React from "react";

export function UsdkIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="usdk-g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#166534" />
        </linearGradient>
      </defs>
      <polygon points="60,5 110,35 110,85 60,115 10,85 10,35" fill="#0f172a" stroke="url(#usdk-g)" strokeWidth="6" />
      <path d="M40 30 v60 M40 60 l40 -30 M40 60 l40 30" stroke="url(#usdk-g)" strokeWidth="10" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export const SusdkIcon = UsdkIcon;
