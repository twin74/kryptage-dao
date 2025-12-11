import React from "react";

export function UsdkIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="usdk-g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
      </defs>
      <polygon points="60,5 110,35 110,85 60,115 10,85 10,35" fill="#f1f5f9" stroke="url(#usdk-g)" strokeWidth="6" />
      <text x="50%" y="54%" textAnchor="middle" fontSize="32" fontWeight="bold" fill="#0ea5e9" dy=".3em" fontFamily="'Inter',sans-serif">U$</text>
      <text x="50%" y="75%" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#334155" dy=".3em" fontFamily="'Inter',sans-serif">DK</text>
    </svg>
  );
}

export function SusdkIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="susdk-g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#a5b4fc" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <polygon points="60,5 110,35 110,85 60,115 10,85 10,35" fill="#f8fafc" stroke="url(#susdk-g)" strokeWidth="6" />
      <text x="50%" y="54%" textAnchor="middle" fontSize="32" fontWeight="bold" fill="#6366f1" dy=".3em" fontFamily="'Inter',sans-serif">sU$</text>
      <text x="50%" y="75%" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#334155" dy=".3em" fontFamily="'Inter',sans-serif">DK</text>
    </svg>
  );
}
