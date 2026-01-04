import Link from "next/link";
import { cn, truncateText } from "@/lib/utils";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  items: BreadcrumbItem[];
  className?: string;
  /**
   * Truncates long breadcrumb labels for readability.
   * Full label is preserved in a `title` tooltip when truncated.
   */
  maxItemLength?: number;
  maxLastItemLength?: number;
};

export const Breadcrumbs = ({
  items,
  className,
  maxItemLength = 40,
  maxLastItemLength = 32,
}: Props) => {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-1 text-codGray/70">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          const showLink = Boolean(item.href && !isLast);
          const resolvedMaxLength = isLast ? maxLastItemLength : maxItemLength;
          const displayLabel = truncateText(item.label, {
            maxLength: resolvedMaxLength,
          });
          const isTruncated = displayLabel !== item.label.trim();

          return (
            <li
              key={`${item.label}-${idx}`}
              className="flex items-center gap-1"
            >
              {idx > 0 ? (
                <span aria-hidden="true" className="px-1 text-codGray/40">
                  /
                </span>
              ) : null}

              {showLink ? (
                <Link
                  href={item.href as string}
                  className="link-underline"
                  title={isTruncated ? item.label : undefined}
                >
                  {displayLabel}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn(isLast && "text-codGray/90 font-medium")}
                  title={isTruncated ? item.label : undefined}
                >
                  {displayLabel}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
