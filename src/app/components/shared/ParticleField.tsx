import React from "react";
import { cn } from "../../types";

export function ParticleField({ className }: { className?: string }) {
  const dots = Array.from({ length: 30 });
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {dots.map((_, i) => {
        const size = Math.random() * 3 + 2; // 2px to 5px
        const top = `${Math.random() * 100}%`;
        const left = `${Math.random() * 100}%`;
        const animationDuration = `${Math.random() * 25 + 15}s`; // 15s to 40s
        const opacity = Math.random() * 0.15 + 0.15; // 15% to 30%

        return (
          <div
            key={i}
            className="absolute rounded-full bg-primary"
            style={{
              width: size,
              height: size,
              top,
              left,
              opacity,
              animation: `drift-${i % 5} ${animationDuration} infinite alternate ease-in-out`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes drift-0 { 0% { transform: translate(0, 0); } 100% { transform: translate(30px, -50px); } }
        @keyframes drift-1 { 0% { transform: translate(0, 0); } 100% { transform: translate(-40px, 40px); } }
        @keyframes drift-2 { 0% { transform: translate(0, 0); } 100% { transform: translate(50px, 20px); } }
        @keyframes drift-3 { 0% { transform: translate(0, 0); } 100% { transform: translate(-20px, -30px); } }
        @keyframes drift-4 { 0% { transform: translate(0, 0); } 100% { transform: translate(25px, 60px); } }
      `}</style>
    </div>
  );
}
