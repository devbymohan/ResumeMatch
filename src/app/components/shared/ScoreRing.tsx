import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

export function ScoreRing({ score, size = 160 }: { score: number; size?: number }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    let cur = 0;
    const t = setInterval(() => { 
      cur += 2; 
      setDisplayed(Math.min(cur, score)); 
      if (cur >= score) clearInterval(t); 
    }, 18);
    return () => clearInterval(t);
  }, [score]);
  
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const color = score >= 80 ? "#059669" : score >= 60 ? "#F97316" : "#EF4444";
  
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: [
            `0 0 15px 0px ${color}40`,
            `0 0 25px 5px ${color}60`,
            `0 0 15px 0px ${color}40`,
          ]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ zIndex: 0 }}
      />
      <svg width={size} height={size} className="-rotate-90 relative z-10">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ - (displayed / 100) * circ}
          style={{ transition: "stroke-dashoffset 0.1s linear" }} />
      </svg>
      <div className="absolute flex flex-col items-center z-10">
        <span className="font-black" style={{ fontFamily: "'JetBrains Mono', monospace", color, fontSize: size * 0.22 }}>
          {displayed}
        </span>
        <span className="text-xs text-muted-foreground mt-0.5">ATS Score</span>
      </div>
    </div>
  );
}
