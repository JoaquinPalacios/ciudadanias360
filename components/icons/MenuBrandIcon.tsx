import * as React from "react";
import { cn } from "@/lib/utils";

type MenuBrandIconProps = React.SVGProps<SVGSVGElement> & {
  strokeWidth?: number;
  accentClassName?: string;
};

/**
 * Brand-aligned menu icon: "text lines" + a small stamp/badge accent (less burger).
 */
export function MenuBrandIcon({
  className,
  strokeWidth = 2.25,
  accentClassName = "text-tussok",
  ...props
}: MenuBrandIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("size-6", className)}
      {...props}
    >
      {/* Text lines */}
      <path
        d="M5.5 7.5H15"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M5.5 12H12.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M5.5 16.5H15"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}
