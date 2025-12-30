import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";
import { linkResolver } from "@/lib/prismic/linkResolver";

/**
 * Props for `MenuItem`.
 */
export type MenuItemProps = SliceComponentProps<Content.MenuItemSlice>;

const getLinkText = (linkField: unknown): string | undefined => {
  if (!linkField || typeof linkField !== "object") return undefined;
  const link = linkField as { text?: unknown };
  return typeof link.text === "string" && link.text.trim().length
    ? link.text
    : undefined;
};

/**
 * Component for "MenuItem" Slices.
 */
const MenuItem: FC<MenuItemProps> = ({ slice }) => {
  return (
    <div
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="flex flex-col items-start gap-2 lg:flex-row lg:items-center lg:gap-12 xl:gap-16"
    >
      {slice.primary.links?.map((item, idx) => {
        if (!isFilled.link(item.link)) return null;
        const text = getLinkText(item.link) || "Abrir";

        return (
          <PrismicNextLink
            key={idx}
            field={item.link}
            linkResolver={linkResolver}
            className="w-full lg:w-auto text-tussok hover:text-tussok transition-colors text-xl lg:text-lg font-medium tracking-wide py-2"
          >
            {text}
          </PrismicNextLink>
        );
      })}
    </div>
  );
};

export default MenuItem;
