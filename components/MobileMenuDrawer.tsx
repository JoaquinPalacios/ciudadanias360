"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import type { Content } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { useEffect, useId, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { linkResolver } from "@/lib/prismic/linkResolver";
import { AnimatedHamburgerIcon } from "@/components/icons/AnimatedHamburgerIcon";

type MobileMenuDrawerProps = {
  /**
   * Preferred: pass the Prismic `menu` document so mobile can render + animate
   * links directly (no DOM-query animation hacks).
   */
  menu?: Content.MenuDocument;
  /**
   * Back-compat: if `menu` is not provided, render these contents in the sheet.
   * Staggered link animation will not apply.
   */
  children?: React.ReactNode;
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
  menu,
  children,
  className,
  triggerClassName,
  label = "Open menu",
}: MobileMenuDrawerProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const pathname = usePathname();

  const close = () => setOpen(false);
  const toggle = () => setOpen((v) => !v);

  const reduceMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
    );
  }, []);

  // Close on navigation (including same-page navigations with a new pathname).
  useEffect(() => {
    if (!open) return;
    close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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

  // Softer than the previous curve: less “snap”, smoother acceleration/deceleration.
  const ease = [0.25, 0.1, 0.25, 1] as const;

  const links = useMemo(() => {
    const getLinkText = (linkField: unknown): string | undefined => {
      if (!linkField || typeof linkField !== "object") return undefined;
      const link = linkField as { text?: unknown };
      return typeof link.text === "string" && link.text.trim().length
        ? link.text
        : undefined;
    };

    if (!menu) return [];
    const out: Array<{
      key: string;
      field: Content.MenuItemSliceDefaultPrimaryLinksItem["link"];
      text: string;
    }> = [];

    menu.data.slices.forEach((slice, sliceIdx) => {
      if (slice.slice_type !== "menu_item") return;
      // `links` is a GroupField; each item has `link`.
      (slice.primary.links ?? []).forEach((item, itemIdx) => {
        if (!isFilled.link(item.link)) return;
        const text = getLinkText(item.link) || "Abrir";
        const keyCandidate =
          (item.link as unknown as { id?: string; url?: string; uid?: string })
            ?.id ||
          (item.link as unknown as { url?: string })?.url ||
          (item.link as unknown as { uid?: string })?.uid ||
          `${sliceIdx}-${itemIdx}`;
        out.push({ key: String(keyCandidate), field: item.link, text });
      });
    });

    return out;
  }, [menu]);

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
        <AnimatedHamburgerIcon
          isOpen={open}
          reduceMotion={reduceMotion}
          className="size-6"
        />
      </button>

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <motion.div
                  // Keep below the sticky navbar so the trigger morph stays visible.
                  className="fixed inset-0 z-40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.28,
                    ease,
                  }}
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
                      "absolute right-0 top-0 h-full w-[90vw] max-w-sm",
                      "bg-tamarind/95 backdrop-blur-md",
                      "border-l border-white/10",
                      "shadow-2xl"
                    )}
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.5,
                      ease,
                    }}
                  >
                    <div className="h-full flex flex-col">
                      <motion.div
                        className="flex items-center justify-between px-6 py-5 border-b border-white/10"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{
                          duration: reduceMotion ? 0 : 0.32,
                          ease,
                          delay: reduceMotion ? 0 : 0.06,
                        }}
                      >
                        <p className="text-white/80 text-sm tracking-wide uppercase">
                          Menu
                        </p>
                        <button
                          type="button"
                          aria-label="Close menu"
                          onClick={close}
                          className="inline-flex items-center justify-center rounded-md h-10 w-10 text-white/90 hover:bg-white/10 transition-colors"
                        >
                          <AnimatedHamburgerIcon
                            isOpen
                            reduceMotion={reduceMotion}
                            className="size-5"
                          />
                        </button>
                      </motion.div>

                      <div className="flex-1 overflow-y-auto px-6 py-6">
                        {menu ? (
                          <motion.nav
                            aria-label="Mobile navigation"
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={{
                              closed: {},
                              open: {
                                transition: {
                                  delayChildren: reduceMotion ? 0 : 0.16,
                                  staggerChildren: reduceMotion ? 0 : 0.075,
                                },
                              },
                            }}
                            onClick={(e) => {
                              const target = e.target as HTMLElement | null;
                              const anchor = target?.closest?.("a");
                              if (anchor) close();
                            }}
                          >
                            <motion.ul className="flex flex-col gap-2">
                              {links.map((item, idx) => (
                                <motion.li
                                  key={`${item.key}-${idx}`}
                                  variants={{
                                    closed: { opacity: 0, x: 16 },
                                    open: {
                                      opacity: 1,
                                      x: 0,
                                      transition: {
                                        duration: reduceMotion ? 0 : 0.38,
                                        ease,
                                      },
                                    },
                                  }}
                                >
                                  <PrismicNextLink
                                    field={item.field}
                                    linkResolver={linkResolver}
                                    className={cn(
                                      "group block w-full",
                                      "text-tussok hover:text-tussok",
                                      "transition-colors",
                                      "text-2xl font-medium tracking-wide py-2"
                                    )}
                                  >
                                    <span className="link-underline--group">
                                      {item.text}
                                    </span>
                                  </PrismicNextLink>
                                </motion.li>
                              ))}
                            </motion.ul>
                          </motion.nav>
                        ) : (
                          <div
                            onClick={(e) => {
                              const target = e.target as HTMLElement | null;
                              const anchor = target?.closest?.("a");
                              if (anchor) close();
                            }}
                          >
                            {children}
                          </div>
                        )}
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
