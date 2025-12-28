import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { ServiceCards } from "./components/ServiceCards";

/**
 * Props for `Services`.
 */
export type ServicesProps = SliceComponentProps<Content.ServicesSlice>;

/**
 * Component for "Services" Slices.
 */
const Services: FC<ServicesProps> = ({ slice }) => {
  const { titulo, cards } = slice.primary;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="px-4 pb-16 pt-12 lg:px-6 lg:py-20 relative overflow-hidden bg-carrara"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-7 lg:gap-16 relative z-20">
        {titulo ? (
          <h2 className="text-finn text-center max-w-4xl mx-auto leading-none text-pretty">
            {titulo}
          </h2>
        ) : null}

        {cards?.length ? <ServiceCards cards={cards} /> : null}
      </div>
    </section>
  );
};

export default Services;
