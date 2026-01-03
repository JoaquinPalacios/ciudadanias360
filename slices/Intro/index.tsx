import { FC } from "react";
import { Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";
import { CircleCheckBig } from "lucide-react";

/**
 * Props for `Intro`.
 */
export type IntroProps = SliceComponentProps<Content.IntroSlice>;

/**
 * Component for "Intro" Slices.
 */
const Intro: FC<IntroProps> = ({ slice }) => {
  const { titulo, texto, enumeracion, imagen } = slice.primary;
  const hasEnumeracion = Boolean(enumeracion?.length);
  const hasImagen = Boolean(imagen?.url);
  const hasSideBySide = hasEnumeracion || hasImagen;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="px-4 py-12 lg:px-6 lg:py-20 relative overflow-hidden bg-carrara"
    >
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <div className="absolute top-0 -left-24 h-72 w-72 rounded-full bg-laser/15 blur-3xl" />
      </div>

      <div className="mx-auto flex w-full max-w-8xl flex-col gap-6 relative z-20">
        {titulo ? (
          <h2 className="text-finn text-center max-w-4xl mx-auto leading-none text-pretty">
            {titulo}
          </h2>
        ) : null}

        {texto ? (
          <p className="max-w-4xl mx-auto text-mineShaft text-center text-lg lg:text-2xl mb-6 lg:mb-10 text-balance md:text-pretty">
            {texto}
          </p>
        ) : null}

        {hasSideBySide ? (
          <div
            className={[
              "w-full mx-auto grid gap-6 items-start lg:items-center",
              hasEnumeracion && hasImagen ? "md:grid-cols-2" : "md:grid-cols-1",
            ].join(" ")}
          >
            {hasEnumeracion ? (
              <div className="flex flex-col gap-6 lg:gap-10">
                {enumeracion!.map((item, index) => {
                  const hasText = Boolean(item.titulo || item.texto);
                  if (!hasText) return null;

                  return (
                    <div key={index} className="flex gap-4">
                      <CircleCheckBig className="mt-1 h-6 w-6 shrink-0 text-tussok" />
                      <div className="flex flex-col gap-1">
                        {item.titulo ? (
                          <h3 className="text-finn font-semibold text-xl md:text-2xl leading-snug">
                            {item.titulo}
                          </h3>
                        ) : null}
                        {item.texto ? (
                          <p className="text-finn/80 text-base md:text-lg leading-relaxed text-pretty">
                            {item.texto}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}

            {hasImagen ? (
              <div className="w-full flex justify-center md:justify-end">
                <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden ring-1 ring-black/5">
                  <PrismicNextImage
                    field={imagen}
                    className="h-auto w-full object-cover"
                    loading="lazy"
                    fallbackAlt=""
                  />
                  {/* Subtle left-edge fade into the section background */}
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(248,248,245,0.95)_0%,rgba(248,248,245,0.35)_22%,rgba(248,248,245,0)_45%)] md:bg-[linear-gradient(90deg,rgba(248,248,245,0.95)_0%,rgba(248,248,245,0.35)_22%,rgba(248,248,245,0)_45%)]" />
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default Intro;
