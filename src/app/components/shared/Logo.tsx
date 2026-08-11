import React from "react";

export function Logo({ size = 32, showText = true }: { size?: number; showText?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="10" fill="#059669" />
        <path d="M10 10h12a6 6 0 010 12H10V10z" fill="white" fillOpacity="0.95" />
        <path d="M10 24h16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M10 29h10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="29" cy="28" r="6" fill="#F97316" />
        <path d="M26.5 28l2 2 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {showText && (
        <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-lg font-bold tracking-tight text-foreground">
          Resume<span className="text-primary">Match</span>
        </span>
      )}
    </div>
  );
}
