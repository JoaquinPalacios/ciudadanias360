import { Content } from "@prismicio/client";
import { Earth, TicketsPlane } from "lucide-react";
import { DocumentBadgeIcon } from "@/components/icons/DocumentBadgeIcon";
import { ArgentinaCitizenshipVisaIcon } from "@/components/icons/ArgentinaCitizenshipVisaIcon";

type Props = {
  icono: Content.ServicesSliceDefaultPrimaryCardsItem["icono"];
};

export const ServiceCardIcon = ({ icono }: Props) => {
  const value = icono ?? null;

  switch (value) {
    case "Ciudadanias":
      return <DocumentBadgeIcon className="size-6 fill-tussok" />;
    case "Visas":
      return <TicketsPlane className="size-6 text-tussok" strokeWidth={1.25} />;
    case "Consulares":
      return <Earth className="size-6 text-tussok" strokeWidth={1.25} />;
    case "Argentina":
      return <ArgentinaCitizenshipVisaIcon className="size-6" />;
    default:
      return null;
  }
};
