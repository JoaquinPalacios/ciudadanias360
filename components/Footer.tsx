import { Logo } from "./Logo";
import type { Content } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";

type FooterProps = {
  footer: Content.FooterDocument;
  detalleContacto?: Content.DetallecontactoDocument | null;
};

const normalizeHref = (
  rawHref: string,
  tipo?: string | null
): string | null => {
  const trimmed = rawHref.trim();
  if (!trimmed) return null;

  // If the user already provided a fully-qualified href, trust it.
  if (
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("http://")
  ) {
    return trimmed;
  }

  // Plain email address -> mailto:
  const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  if (looksLikeEmail) return `mailto:${trimmed}`;

  // Common schemeless URLs -> https://
  if (
    trimmed.startsWith("wa.me/") ||
    trimmed.startsWith("api.whatsapp.com/") ||
    trimmed.startsWith("web.whatsapp.com/") ||
    trimmed.startsWith("www.")
  ) {
    return `https://${trimmed}`;
  }

  // Whatsapp phone number (digits, spaces, +, etc) -> https://wa.me/<digits>
  const digitsOnly = trimmed.replace(/[^\d]/g, "");
  const looksLikePhoneish = digitsOnly.length >= 8;
  if (
    tipo === "Whatsapp" &&
    looksLikePhoneish &&
    /^[\d+\s().-]+$/.test(trimmed)
  ) {
    return `https://wa.me/${digitsOnly}`;
  }

  return null;
};

export const Footer = ({ footer, detalleContacto }: FooterProps) => {
  const contactItems = detalleContacto?.data?.detalle_de_contacto ?? [];

  return (
    <footer className="bg-tamarind border-t border-white/40">
      <div className="mx-auto w-full max-w-8xl relative z-20 px-4 py-12 lg:px-6 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 xl:gap-40 lg:items-start lg:justify-between">
          <div className="flex flex-col items-center gap-6 lg:items-end">
            <div className="flex items-center justify-center gap-4">
              <Logo height={32} width={32} />
              <h3 className="text-tussok text-2xl font-bold">
                Ciudadanías <span className="font-normal">360</span>
              </h3>
            </div>

            {contactItems.length ? (
              <ul className="flex flex-col items-center gap-2 lg:items-start">
                {contactItems.map((item, idx) => {
                  const href = normalizeHref(item.link_url || "", item.tipo);
                  if (!href) return null;

                  const text =
                    item.link_label?.trim?.() || item.tipo || "Abrir";

                  return (
                    <li key={idx}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/80 hover:text-white transition-colors"
                      >
                        {text}
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12 flex-1">
            <SliceZone slices={footer.data.slices} components={components} />
          </div>
        </div>
      </div>
      <small className="text-white/70 text-sm text-center w-full pb-4 lg:py-4 inline-block">
        &copy; {new Date().getFullYear()} Todos los derechos reservados.
      </small>
    </footer>
  );
};
