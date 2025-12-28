import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `FooterItem`.
 */
export type FooterItemProps = SliceComponentProps<Content.FooterItemSlice>;

const getLinkText = (linkField: unknown): string | undefined => {
  if (!linkField || typeof linkField !== "object") return undefined;
  const link = linkField as { text?: unknown };
  return typeof link.text === "string" && link.text.trim().length
    ? link.text
    : undefined;
};

/**
 * Component for "FooterItem" Slices.
 */
const FooterItem: FC<FooterItemProps> = ({ slice }) => {
  const title = slice.primary.titulo;

  return (
    <div
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="flex flex-col gap-3"
    >
      {title ? (
        <h4 className="text-tussok font-semibold tracking-wide text-lg">
          {title}
        </h4>
      ) : null}

      {slice.primary.links?.length ? (
        <ul className="flex flex-col gap-2">
          {slice.primary.links.map((item, idx) => {
            if (!isFilled.link(item.link)) return null;
            const text = getLinkText(item.link) || "Abrir";

            return (
              <li key={idx}>
                <PrismicNextLink
                  field={item.link}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  {text}
                </PrismicNextLink>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};

export default FooterItem;
