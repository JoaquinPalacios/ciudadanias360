"use client";

import { animate } from "motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type NavbarScrollProps = {
  children: React.ReactNode;
  className?: string;
  /**
   * Don't start the hide/show behavior until the user has scrolled past this point.
   * Before this threshold, the navbar is forced visible.
   */
  startAfterPx?: number;
  /**
   * Within this many pixels from the top of the page, the navbar is forced visible.
   */
  topThresholdPx?: number;
  /**
   * Minimum scroll distance (while scrolling down) before we hide.
   */
  hideDeltaPx?: number;
  /**
   * Minimum scroll distance (while scrolling up) before we show.
   */
  showDeltaPx?: number;
};

export function NavbarScroll({
  children,
  className,
  startAfterPx = 160,
  topThresholdPx = 12,
  hideDeltaPx = 18,
  showDeltaPx = 32,
}: NavbarScrollProps) {
  const headerRef = useRef<HTMLElement | null>(null);
  const controlsRef = useRef<ReturnType<typeof animate> | null>(null);
  const animationIdRef = useRef(0);

  const lastScrollYRef = useRef<number>(0);
  const directionRef = useRef<"up" | "down" | null>(null);
  const directionStartYRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  const [isVisible, setIsVisible] = useState(true);
  const isVisibleRef = useRef(true);
  const [isFullyVisible, setIsFullyVisible] = useState(true);

  const [reduceMotion, setReduceMotion] = useState(false);
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    reduceMotionRef.current = reduceMotion;
  }, [reduceMotion]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(Boolean(mql?.matches));
    update();
    mql?.addEventListener?.("change", update);
    return () => mql?.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    lastScrollYRef.current = window.scrollY || 0;
    directionRef.current = null;
    directionStartYRef.current = window.scrollY || 0;

    const onScroll = () => {
      if (rafRef.current != null) return;

      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;

        const y = window.scrollY || 0;
        const prevY = lastScrollYRef.current;
        lastScrollYRef.current = y;

        // Don't start the behavior immediately—keep navbar visible until a bit down the page.
        if (y < startAfterPx) {
          if (!isVisibleRef.current) {
            isVisibleRef.current = true;
            setIsVisible(true);
            setIsFullyVisible(reduceMotionRef.current ? true : false);
          }
          directionRef.current = null;
          directionStartYRef.current = y;
          return;
        }

        // Always show at the very top.
        if (y <= topThresholdPx) {
          if (!isVisibleRef.current) {
            isVisibleRef.current = true;
            setIsVisible(true);
            setIsFullyVisible(reduceMotionRef.current ? true : false);
          }
          directionRef.current = null;
          directionStartYRef.current = y;
          return;
        }

        const direction: "up" | "down" | null =
          y > prevY ? "down" : y < prevY ? "up" : null;
        if (!direction) return;

        // When direction changes, reset the reference point so we measure
        // distance scrolled in the current direction.
        if (directionRef.current !== direction) {
          directionRef.current = direction;
          directionStartYRef.current = prevY;
        }

        const deltaInDirection = y - directionStartYRef.current;

        // Hide: user scrolls down a bit (and not near top).
        if (direction === "down" && deltaInDirection > hideDeltaPx) {
          if (isVisibleRef.current) {
            isVisibleRef.current = false;
            setIsVisible(false);
            setIsFullyVisible(false);
          }
          return;
        }

        // Show: user scrolls up enough (mid-page / bottom included).
        if (direction === "up" && -deltaInDirection > showDeltaPx) {
          if (!isVisibleRef.current) {
            isVisibleRef.current = true;
            setIsVisible(true);
            setIsFullyVisible(reduceMotionRef.current ? true : false);
          }
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
    };
  }, [hideDeltaPx, showDeltaPx, startAfterPx, topThresholdPx]);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const targetY = isVisible ? 0 : -el.offsetHeight;
    const animationId = ++animationIdRef.current;

    // Cancel any in-flight animation.
    try {
      controlsRef.current?.cancel?.();
      controlsRef.current?.stop?.();
    } catch {
      // no-op
    }

    controlsRef.current = animate(
      el,
      // `motion`'s DOM `animate()` types (re-exporting `framer-motion/dom`) don't currently
      // accept transform props on `HTMLElement` targets, even though it works at runtime.
      // We cast this single argument to keep behavior + fix the TS error.
      { transform: `translateY(${targetY}px)` } as unknown as never,
      {
        duration: reduceMotion ? 0 : 0.22,
        easing: [0.22, 1, 0.36, 1],
      } as unknown as never
    );

    const finished: Promise<unknown> | undefined = (
      controlsRef.current as unknown as {
        finished?: Promise<unknown>;
      }
    )?.finished;

    if (isVisible && !reduceMotion && finished) {
      void finished.then(() => {
        // Ignore if a newer animation started.
        if (animationIdRef.current !== animationId) return;
        setIsFullyVisible(true);
      });
    }
  }, [isVisible, reduceMotion]);

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-50 will-change-transform",
        "bg-tamarind",
        isVisible && isFullyVisible && "border-b border-white/20",
        className
      )}
    >
      {children}
    </header>
  );
}
