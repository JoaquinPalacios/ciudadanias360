import { FC } from "react";
import { Content } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackgroundRings } from "@/components/BackgroundRings";

/**
 * Props for `Cta`.
 */
export type CtaProps = SliceComponentProps<Content.CtaSlice>;

const isFilledLink = (linkField: unknown): boolean => {
  if (!linkField || typeof linkField !== "object") return false;
  const link = linkField as { link_type?: string; url?: unknown };
  if (link.link_type === "Any") return false;
  if (typeof link.url === "string") return link.url.trim().length > 0;
  return true;
};

const getLinkText = (linkField: unknown): string | undefined => {
  if (!linkField || typeof linkField !== "object") return undefined;
  const link = linkField as { text?: unknown };
  return typeof link.text === "string" && link.text.trim().length
    ? link.text
    : undefined;
};

const getLinkUrl = (linkField: unknown): string | undefined => {
  if (!linkField || typeof linkField !== "object") return undefined;
  const link = linkField as { url?: unknown };
  return typeof link.url === "string" && link.url.trim().length
    ? link.url.trim()
    : undefined;
};

const normalizeWhatsappHref = (rawHref: string): string | null => {
  const trimmed = rawHref.trim();
  if (!trimmed) return null;

  // Already a usable href.
  if (
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("http://")
  ) {
    return trimmed;
  }

  // Common schemeless WhatsApp URLs -> https://
  if (
    trimmed.startsWith("wa.me/") ||
    trimmed.startsWith("api.whatsapp.com/") ||
    trimmed.startsWith("web.whatsapp.com/")
  ) {
    return `https://${trimmed}`;
  }

  // Phone number (digits, spaces, +, etc) -> https://wa.me/<digits>
  const digitsOnly = trimmed.replace(/[^\d]/g, "");
  const looksLikePhoneish = digitsOnly.length >= 8;
  if (looksLikePhoneish && /^[\d+\s().-]+$/.test(trimmed)) {
    return `https://wa.me/${digitsOnly}`;
  }

  // Relative/internal links are not valid WhatsApp destinations.
  return null;
};

/**
 * Component for "Cta" Slices.
 */
const Cta: FC<CtaProps> = ({ slice }) => {
  const { titulo, texto, contacto, whatsapp } = slice.primary;
  const hasContacto = isFilledLink(contacto);
  const whatsappUrl = getLinkUrl(whatsapp);
  const whatsappHref = whatsappUrl ? normalizeWhatsappHref(whatsappUrl) : null;
  const hasWhatsapp = Boolean(whatsappHref) || isFilledLink(whatsapp);
  const contactoText = getLinkText(contacto) || "Agendá una consulta";
  const whatsappText = getLinkText(whatsapp) || "Escribinos por WhatsApp";

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="px-4 py-20 lg:px-6 lg:py-28 relative overflow-hidden text-white bg-linear-to-b from-tamarind via-finn to-cosmic"
    >
      {/* Subtle vignette / glow overlays */}
      <div
        className="absolute inset-0 z-0 pointer-events-none select-none"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(800px_380px_at_50%_35%,rgba(255,255,255,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_50%_65%,rgba(190,158,68,0.14),transparent_65%)]" />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <BackgroundRings className="z-[1]" />

      <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center gap-6 relative z-10">
        {titulo ? (
          <h2 className="font-normal text-white text-balance leading-[1.05] max-w-4xl">
            {titulo}
          </h2>
        ) : null}

        {texto ? (
          <p className="max-w-3xl mx-auto text-white/80 text-center text-lg lg:text-2xl font-normal text-balance sm:text-pretty mb-4 lg:mb-7">
            {texto}
          </p>
        ) : null}

        {hasContacto || hasWhatsapp ? (
          <div className="flex w-full flex-col items-center gap-4">
            {hasContacto ? (
              <Button asChild size="lg" className="font-normal w-full max-w-sm">
                <PrismicNextLink field={contacto}>
                  {contactoText}
                </PrismicNextLink>
              </Button>
            ) : null}

            {hasWhatsapp ? (
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="font-normal w-full max-w-sm"
              >
                {whatsappHref ? (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {whatsappText} <ArrowUpRight className="size-4 ml-2" />
                  </a>
                ) : (
                  <PrismicNextLink
                    field={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="backdrop-blur-sm"
                  >
                    {whatsappText} <ArrowUpRight className="size-4 ml-2" />
                  </PrismicNextLink>
                )}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default Cta;
