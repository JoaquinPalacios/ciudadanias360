import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";
import { buttonVariants } from "@/components/ui/button";

/**
 * Props for `Error`.
 */
export type ErrorProps = SliceComponentProps<Content.ErrorSlice>;

/**
 * Component for "Error" Slices.
 *
 * Used for 404 and other error pages via Prismic-managed content.
 */
const Error: FC<ErrorProps> = ({ slice }) => {
  const { titulo, texto, link } = slice.primary;
  const hasLink = isFilled.link(link);
  const linkText =
    hasLink && "text" in link && link.text ? link.text : "Volver al inicio";

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="px-4 py-12 lg:px-6 lg:py-20 relative bg-carrara"
    >
      {/* Decorative blur */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <div className="absolute top-0 -left-24 h-72 w-72 rounded-full bg-laser/15 blur-3xl" />
      </div>

      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 relative z-20 text-center">
        {titulo ? (
          <h2 className="text-finn leading-none text-pretty">{titulo}</h2>
        ) : null}

        {texto ? (
          <p className="max-w-2xl text-mineShaft text-lg lg:text-2xl text-balance">
            {texto}
          </p>
        ) : null}

        {hasLink ? (
          <PrismicNextLink
            field={link}
            className={buttonVariants({ variant: "default", size: "lg" })}
          >
            {linkText}
          </PrismicNextLink>
        ) : null}
      </div>
    </section>
  );
};

export default Error;
