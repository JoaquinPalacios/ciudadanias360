import { Content } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";
import { ArrowRight, Check } from "lucide-react";
import { ServiceCardIcon } from "./ServiceCardIcon";
import { richTextComponents } from "@/lib/prismic/richText";

type Props = {
  card: Content.ServicesSliceDefaultPrimaryCardsItem;
};

export const ServiceCard = ({ card }: Props) => {
  const linkText =
    card.link && typeof card.link === "object" && "text" in card.link
      ? (card.link.text as string | null | undefined)
      : undefined;

  const cardRichTextComponents = {
    ...richTextComponents,
    list: ({ children }: { children: React.ReactNode }) => (
      <ul className="list-none m-0 p-0 flex flex-col gap-2">{children}</ul>
    ),
    listItem: ({ children }: { children: React.ReactNode }) => (
      <li className="flex gap-2">
        <Check
          className="mt-1 size-4 shrink-0 text-tussok"
          aria-hidden="true"
        />
        <span>{children}</span>
      </li>
    ),
    oList: ({ children }: { children: React.ReactNode }) => (
      <ol className="list-none m-0 p-0 flex flex-col gap-2">{children}</ol>
    ),
    oListItem: ({ children }: { children: React.ReactNode }) => (
      <li className="flex gap-2">
        <Check
          className="mt-1 size-4 shrink-0 text-tussok"
          aria-hidden="true"
        />
        <span>{children}</span>
      </li>
    ),
  };

  return (
    <div className="bg-white w-full backdrop-blur-md p-4 md:px-5 rounded-xl shadow flex flex-col">
      {card.titulo ? (
        <h3 className="text-xl lg:text-2xl font-semibold text-finn mt-2 flex items-center gap-2">
          <ServiceCardIcon icono={card.icono} />
          {card.titulo}
        </h3>
      ) : null}
      {card.texto ? (
        <p className="mt-2 lg:text-lg text-codGray/90">{card.texto}</p>
      ) : null}
      {card.lista ? (
        <div className="mt-3 text-base text-codGray/90 mb-4">
          <PrismicRichText
            field={card.lista}
            components={cardRichTextComponents}
          />
        </div>
      ) : null}
      {card.link ? (
        <PrismicNextLink
          field={card.link}
          className="mt-auto inline-flex items-center gap-1 text-tussok hover:underline underline-offset-4"
        >
          {linkText || "Ver más"}
          <ArrowRight className="size-4 mt-0.5" aria-hidden="true" />
        </PrismicNextLink>
      ) : null}
    </div>
  );
};
