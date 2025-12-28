import { Logo } from "./Logo";
import type { Content } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";

type FooterProps = {
  footer: Content.FooterDocument;
};

export const Footer = ({ footer }: FooterProps) => {
  return (
    <footer className="bg-tamarind border-t border-white/40">
      <div className="mx-auto w-full max-w-8xl relative z-20 px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-16 xl:gap-40 lg:items-start lg:justify-between">
          <div className="flex flex-col items-center gap-6 lg:items-end">
            <div className="flex items-center justify-center gap-4">
              <Logo height={32} width={32} />
              <h3 className="text-tussok text-2xl font-bold">
                Ciudadanías <span className="font-normal">360</span>
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 flex-1">
            <SliceZone slices={footer.data.slices} components={components} />
          </div>
        </div>
      </div>
      <small className="text-white/70 text-sm text-center w-full py-4 inline-block">
        &copy; {new Date().getFullYear()} Todos los derechos reservados.
      </small>
    </footer>
  );
};
