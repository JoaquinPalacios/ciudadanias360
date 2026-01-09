"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealOnceProps = {
  children: ReactNode;
  className?: string;
  /** IntersectionObserver rootMargin (default: "0px 0px -10% 0px") */
  rootMargin?: string;
};

/**
 * Wrapper that sets `data-reveal="true"` the first time it enters the viewport.
 * Once revealed, the observer disconnects so the animation never re-triggers.
 */
export function RevealOnce({
  children,
  className,
  rootMargin = "0px 0px -10% 0px",
}: RevealOnceProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || revealed) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [revealed, rootMargin]);

  return (
    <div ref={ref} className={cn(className)} data-reveal={revealed || undefined}>
      {children}
    </div>
  );
}
