import React from "react";

export function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "#059669" : score >= 60 ? "#F97316" : "#EF4444";
  const label = score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Needs Work";
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: `${color}18`, color }}>
      <span className="size-1.5 rounded-full" style={{ background: color }} />{label}
    </span>
  );
}
