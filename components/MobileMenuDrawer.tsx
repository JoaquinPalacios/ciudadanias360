"use client";

import { AnimatePresence, motion } from "motion/react";
import { animate, stagger } from "motion";
import { X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { MenuBrandIcon } from "@/components/icons/MenuBrandIcon";

type MobileMenuDrawerProps = {
  children: React.ReactNode;
  className?: string;
  /**
   * Only visible below `lg` (1024px). Caller should also hide any desktop nav on mobile.
   */
  triggerClassName?: string;
  /**
   * Accessible label for the trigger button.
   */
  label?: string;
};

export function MobileMenuDrawer({
  children,
  className,
  triggerClassName,
  label = "Open menu",
}: MobileMenuDrawerProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);

  const close = () => setOpen(false);
  const toggle = () => setOpen((v) => !v);

  const reduceMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
    );
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // Fancy: stagger link reveal when the drawer opens (works with server-rendered links).
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    const links = Array.from(panel.querySelectorAll("a"));
    if (!links.length) return;

    // Reset styles immediately so reveal animation is consistent.
    links.forEach((a) => {
      a.style.opacity = "0";
      a.style.transform = "translateX(10px)";
    });

    // Casts are intentional: Motion runtime supports these CSS props, but the TS
    // overloads can be overly strict for DOM targets.
    animate(
      links as unknown as never,
      {
        opacity: [0, 1],
        transform: ["translateX(10px)", "translateX(0px)"],
      } as unknown as never,
      {
        delay: stagger(0.045, { startDelay: reduceMotion ? 0 : 0.08 }),
        duration: reduceMotion ? 0 : 0.22,
        easing: [0.22, 1, 0.36, 1],
      } as unknown as never
    );
  }, [open, reduceMotion]);

  return (
    <div className={cn("lg:hidden", className)}>
      <button
        type="button"
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggle}
        className={cn(
          "inline-flex items-center justify-center rounded-md",
          "size-11",
          "text-white",
          "hover:bg-white/10 transition-colors",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-tussok/70 focus-visible:ring-offset-2 focus-visible:ring-offset-tamarind",
          triggerClassName
        )}
      >
        {open ? (
          <X className="size-5" strokeWidth={2.25} />
        ) : (
          <MenuBrandIcon className="size-8" strokeWidth={1.5} />
        )}
      </button>

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <motion.div
                  className="fixed inset-0 z-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.16 }}
                >
                  {/* Backdrop */}
                  <button
                    type="button"
                    aria-label="Close menu"
                    onClick={close}
                    className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
                  />

                  {/* Drawer */}
                  <motion.aside
                    role="dialog"
                    aria-modal="true"
                    id={panelId}
                    className={cn(
                      "absolute right-0 top-0 h-full w-[86vw] max-w-sm",
                      "bg-tamarind/95 backdrop-blur-md",
                      "border-l border-white/10",
                      "shadow-2xl"
                    )}
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.22,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <div className="h-full flex flex-col">
                      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                        <p className="text-white/80 text-sm tracking-wide uppercase">
                          Menu
                        </p>
                        <button
                          type="button"
                          aria-label="Close menu"
                          onClick={close}
                          className="inline-flex items-center justify-center rounded-md h-10 w-10 text-white/90 hover:bg-white/10 transition-colors"
                        >
                          <X className="size-5" />
                        </button>
                      </div>

                      <div
                        ref={panelRef}
                        className="flex-1 overflow-y-auto px-6 py-6"
                        onClick={(e) => {
                          const target = e.target as HTMLElement | null;
                          const anchor = target?.closest?.("a");
                          if (anchor) close();
                        }}
                      >
                        {children}
                      </div>
                    </div>
                  </motion.aside>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}
    </div>
  );
}
