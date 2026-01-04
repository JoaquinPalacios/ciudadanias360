import { Content } from "@prismicio/client";
import { ServiceCard } from "./ServiceCard";

type Props = {
  cards: Content.ServicesSliceDefaultPrimary["cards"];
};

export const ServiceCards = ({ cards }: Props) => {
  if (!cards?.length) return null;

  const toAnchorId = (input: string): string => {
    return input
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const anchorCounts = new Map<string, number>();
  const getUniqueAnchorId = (preferred?: string, fallback?: string) => {
    const base = toAnchorId(preferred || fallback || "");
    if (!base) return undefined;

    const seen = anchorCounts.get(base) ?? 0;
    anchorCounts.set(base, seen + 1);
    return seen === 0 ? base : `${base}-${seen + 1}`;
  };

  return (
    <div className="grid gap-6 lg:gap-8 xl:gap-10 md:grid-cols-2 md:justify-items-center">
      {cards.map((card, idx) => {
        const anchorId = getUniqueAnchorId(
          card.anchor_id || undefined,
          card.titulo || undefined
        );
        return <ServiceCard key={idx} card={card} anchorId={anchorId} />;
      })}
    </div>
  );
};
