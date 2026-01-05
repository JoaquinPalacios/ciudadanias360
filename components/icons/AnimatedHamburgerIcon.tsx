import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type AnimatedHamburgerIconProps = Omit<
  React.SVGProps<SVGSVGElement>,
  "children"
> & {
  isOpen: boolean;
  strokeWidth?: number;
  /**
   * When true, disables animations for accessibility.
   */
  reduceMotion?: boolean;
};

/**
 * Standard hamburger icon that morphs into an "X".
 * Built as three strokes, animated via Motion variants.
 */
export function AnimatedHamburgerIcon({
  className,
  isOpen,
  strokeWidth = 2.25,
  reduceMotion = false,
  ...props
}: AnimatedHamburgerIconProps) {
  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.32, ease: [0.16, 1, 0.3, 1] as const };

  const state = isOpen ? "open" : "closed";

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("size-6", className)}
      {...props}
    >
      <motion.path
        d="M5 7H19"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        style={{ transformOrigin: "12px 12px", transformBox: "fill-box" }}
        variants={{
          closed: { rotate: 0, y: 0 },
          open: { rotate: 45, y: 5 },
        }}
        animate={state}
        transition={transition}
      />
      <motion.path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        variants={{
          closed: { opacity: 1, scaleX: 1 },
          open: { opacity: 0, scaleX: 0.6 },
        }}
        animate={state}
        transition={transition}
      />
      <motion.path
        d="M5 17H19"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        style={{ transformOrigin: "12px 12px", transformBox: "fill-box" }}
        variants={{
          closed: { rotate: 0, y: 0 },
          open: { rotate: -45, y: -5 },
        }}
        animate={state}
        transition={transition}
      />
    </svg>
  );
}
