import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import { ArrowRight, Earth, TicketsPlane } from "lucide-react";
import { DocumentBadgeIcon } from "@/components/icons/DocumentBadgeIcon";
import { ArgentinaCitizenshipVisaIcon } from "@/components/icons/ArgentinaCitizenshipVisaIcon";

/**
 * Props for `FourCards`.
 */
export type FourCardsProps = SliceComponentProps<Content.FourCardsSlice>;

/**
 * Component for "FourCards" Slices.
 */
const FourCards: FC<FourCardsProps> = ({ slice }) => {
  const { titulo, cards } = slice.primary;

  const icons = [
    <DocumentBadgeIcon key="ciudadanias" className="size-8 fill-tussok" />,
    <ArgentinaCitizenshipVisaIcon key="argentina" className="size-8" />,
    <TicketsPlane
      key="visas"
      className="size-8 text-tussok"
      strokeWidth={1.25}
    />,
    <Earth
      key="consulares"
      className="size-8 text-tussok"
      strokeWidth={1.25}
    />,
  ];

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

        {cards?.length ? (
          <div className="grid gap-6 lg:gap-8 xl:gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, idx) => {
              const hasLink = Boolean(card.link);
              const icon = icons[idx % icons.length];

              const linkText =
                card.link &&
                typeof card.link === "object" &&
                "text" in card.link
                  ? ((card.link as unknown as { text?: string | null }).text ??
                    undefined)
                  : undefined;

              const CardInner = (
                <>
                  <div className="mb-2">{icon}</div>

                  {card.titulo ? (
                    <h3 className="text-xl lg:text-2xl font-semibold text-finn text-pretty mb-3">
                      {card.titulo}
                    </h3>
                  ) : null}

                  {card.texto ? (
                    <p className="text-base lg:text-lg text-codGray/90 leading-relaxed mb-5">
                      {card.texto}
                    </p>
                  ) : null}

                  {hasLink ? (
                    <span className="mt-auto inline-flex items-center gap-2 text-tussok hover:underline group-focus-visible:underline underline-offset-4">
                      {linkText || "Más información"}
                      <ArrowRight
                        className="size-4 mt-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  ) : null}
                </>
              );

              const shellClassName =
                "bg-white rounded-xl border border-black/5 shadow-sm p-4 sm:p-5 xl:p-6 flex flex-col h-full transition-shadow " +
                "hover:shadow-md hover:border-black/10 focus-visible:outline-none focus-visible:ring-2 " +
                "focus-visible:ring-tussok/30 focus-visible:ring-offset-2 focus-visible:ring-offset-carrara";

              if (!hasLink) {
                return (
                  <div key={idx} className={shellClassName}>
                    {CardInner}
                  </div>
                );
              }

              return (
                <PrismicNextLink
                  key={idx}
                  field={card.link}
                  className={`group ${shellClassName}`}
                >
                  {CardInner}
                </PrismicNextLink>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default FourCards;
