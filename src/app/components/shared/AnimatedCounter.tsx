import React, { useState, useEffect, useRef } from "react";

export function AnimatedCounter({ value, duration = 2000 }: { value: number | string; duration?: number }) {
  const [displayed, setDisplayed] = useState(0);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;
  const suffix = typeof value === 'string' ? value.replace(/[0-9.]/g, '') : '';
  const isFloat = !Number.isNaN(numericValue) && !Number.isInteger(numericValue);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || Number.isNaN(numericValue)) return;
    let start = 0;
    const increment = numericValue / (duration / 16);
    const t = setInterval(() => {
      start += increment;
      if (start >= numericValue) {
        setDisplayed(numericValue);
        clearInterval(t);
      } else {
        setDisplayed(start);
      }
    }, 16);
    return () => clearInterval(t);
  }, [inView, numericValue, duration]);

  const displayString = Number.isNaN(numericValue) 
    ? value 
    : (isFloat ? displayed.toFixed(1) : Math.round(displayed).toString());

  return (
    <span ref={ref} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      {displayString}{!Number.isNaN(numericValue) ? suffix : null}
    </span>
  );
}
