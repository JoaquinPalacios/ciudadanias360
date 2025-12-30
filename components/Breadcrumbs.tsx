import Link from "next/link";
import { cn } from "@/lib/utils";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  items: BreadcrumbItem[];
  className?: string;
};

export const Breadcrumbs = ({ items, className }: Props) => {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-1 text-codGray/70">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          const showLink = Boolean(item.href && !isLast);

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
                  className="hover:underline underline-offset-4"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn(isLast && "text-codGray/90 font-medium")}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
