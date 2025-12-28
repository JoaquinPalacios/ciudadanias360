"use client";

import { animate } from "motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type EnumeracionMarqueeProps = {
  items: string[];
  className?: string;
};

function EnumeracionStatic({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-4 gap-y-2 [&>div:first-child>p]:ml-4",
        className
      )}
    >
      {items.map((texto, index) => (
        <div key={`${texto}-${index}`} className="contents">
          <p className="text-white">{texto}</p>
          {index < items.length - 1 ? (
            <span className="text-white/70" aria-hidden="true">
              •
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function EnumeracionSequence({
  items,
  withTrailingSeparator = false,
}: {
  items: string[];
  withTrailingSeparator?: boolean;
}) {
  return (
    <div className="flex shrink-0 items-center gap-x-4">
      {items.map((texto, index) => (
        <div key={`${texto}-${index}`} className="contents">
          <p className="text-white whitespace-nowrap">{texto}</p>
          {index < items.length - 1 || withTrailingSeparator ? (
            <span className="text-white/70" aria-hidden="true">
              •
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function EnumeracionMarquee({
  items,
  className,
}: EnumeracionMarqueeProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = useRef<ReturnType<typeof animate> | null>(null);

  const [reduceMotion, setReduceMotion] = useState(false);

  // Pause on press/hold (mobile-friendly).
  const isPressedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(Boolean(mql?.matches));
    update();
    mql?.addEventListener?.("change", update);
    return () => mql?.removeEventListener?.("change", update);
  }, []);

  const durationSeconds = useMemo(() => {
    // Small heuristic: more items -> slightly slower so it stays readable.
    return Math.min(34, Math.max(16, items.length * 3));
  }, [items.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Always stop any previous animation first (e.g. items change, reduced motion flips).
    try {
      controlsRef.current?.cancel?.();
      controlsRef.current?.stop?.();
    } catch {
      // no-op
    }
    controlsRef.current = null;

    if (reduceMotion) return;

    controlsRef.current = animate(
      track,
      // Translate by half the track width: we render 2 identical sequences side-by-side.
      // `x` accepts percentage strings at runtime.
      { x: ["0%", "-50%"] } as unknown as never,
      {
        duration: durationSeconds,
        easing: "linear",
        repeat: Infinity,
      } as unknown as never
    );

    return () => {
      try {
        controlsRef.current?.cancel?.();
        controlsRef.current?.stop?.();
      } catch {
        // no-op
      }
      controlsRef.current = null;
    };
  }, [durationSeconds, reduceMotion]);

  if (!items.length) return null;

  if (reduceMotion) {
    return <EnumeracionStatic items={items} className={className} />;
  }

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        // Subtle edge fade, keeps motion from feeling distracting.
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        maskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
      }}
      onPointerDown={() => {
        isPressedRef.current = true;
        try {
          controlsRef.current?.pause?.();
        } catch {
          // no-op
        }
      }}
      onPointerUp={() => {
        isPressedRef.current = false;
        try {
          controlsRef.current?.play?.();
        } catch {
          // no-op
        }
      }}
      onPointerCancel={() => {
        isPressedRef.current = false;
        try {
          controlsRef.current?.play?.();
        } catch {
          // no-op
        }
      }}
      onPointerLeave={() => {
        if (!isPressedRef.current) return;
        isPressedRef.current = false;
        try {
          controlsRef.current?.play?.();
        } catch {
          // no-op
        }
      }}
    >
      <div
        ref={trackRef}
        className={cn(
          "flex w-max items-center",
          "will-change-transform select-none",
          "cursor-grab active:cursor-grabbing"
        )}
        style={{
          touchAction: "pan-y",
        }}
      >
        <EnumeracionSequence items={items} withTrailingSeparator />
        <div aria-hidden="true">
          <EnumeracionSequence items={items} withTrailingSeparator />
        </div>
      </div>
    </div>
  );
}
