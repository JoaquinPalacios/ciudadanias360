import { Content } from "@prismicio/client";
import { ServiceCard } from "./ServiceCard";

type Props = {
  cards: Content.ServicesSliceDefaultPrimary["cards"];
};

export const ServiceCards = ({ cards }: Props) => {
  if (!cards?.length) return null;

  return (
    <div className="grid gap-6 lg:gap-8 xl:gap-10 md:grid-cols-2 md:justify-items-center">
      {cards.map((card, idx) => (
        <ServiceCard key={idx} card={card} />
      ))}
    </div>
  );
};
