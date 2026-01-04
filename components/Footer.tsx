import { Logo } from "./Logo";
import type { Content } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import { linkResolver } from "@/lib/prismic/linkResolver";

type FooterProps = {
  footer: Content.FooterDocument;
  detalleContacto?: Content.DetallecontactoDocument | null;
};

const getLinkText = (linkField: unknown): string | undefined => {
  if (!linkField || typeof linkField !== "object") return undefined;
  const link = linkField as { text?: unknown };
  return typeof link.text === "string" && link.text.trim().length
    ? link.text
    : undefined;
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
                  if (!isFilled.link(item.link)) return null;
                  const text = getLinkText(item.link) || item.tipo || "Abrir";

                  return (
                    <li key={idx}>
                      <PrismicNextLink
                        field={item.link}
                        linkResolver={linkResolver}
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
