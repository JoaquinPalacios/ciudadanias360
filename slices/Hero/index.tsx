import { FC, Fragment } from "react";
import { Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { EnumeracionMarquee } from "./components/EnumeracionMarquee";

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
const Hero: FC<HeroProps> = ({ slice }) => {
  const {
    titulo,
    subtitulo,
    background_image,
    mostrar_boton_contacto,
    mostrar_boton_calendario,
    enumeracion,
  } = slice.primary;

  const enumeracionItems =
    enumeracion
      ?.map((item) => item.texto)
      ?.filter((v): v is string => Boolean(v && v.trim())) ?? [];

  const renderTitleWithLastWordAccent = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return null;

    const words = trimmed.split(/\s+/);
    const lastWord = words.pop();
    const rest = words.join(" ");

    return (
      <>
        {rest ? <>{rest} </> : null}
        <span className="text-tussok">{lastWord}</span>
      </>
    );
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="px-4 py-12 lg:px-6 lg:py-16 relative overflow-hidden"
    >
      {/* Background image (optional) */}
      {background_image?.url ? (
        <div
          className="absolute inset-0 z-0 pointer-events-none select-none"
          aria-hidden="true"
        >
          <PrismicNextImage
            field={background_image}
            fill
            sizes="100vw"
            className="object-cover"
            fallbackAlt=""
            loading="eager"
          />
          {/* Finn overlay to blend image into the section background */}
          <div className="absolute inset-0 bg-linear-to-b from-finn/40 via-finn/80 to-finn z-10" />
        </div>
      ) : null}

      {/* Animated background pattern */}
      <div
        className="absolute inset-0 opacity-10 lg:opacity-15 z-10 pointer-events-none select-none"
        aria-hidden="true"
      >
        <div className="absolute top-20 left-20 size-32 lg:size-64 border-2 border-tussok rounded-full" />
        <div className="absolute bottom-20 right-20 size-48 lg:size-96 border-2 border-tussok rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-72 lg:size-[600px] border border-white rounded-full" />
      </div>
      <div className="mx-auto flex w-full max-w-8xl flex-col lg:gap-6 relative z-20 mt-20 md:mt-28 lg:mt-40 mb-6 lg:mb-10">
        {titulo ? (
          <h1 className="text-white text-center max-w-5xl mx-auto leading-none mb-8 lg:mb-10">
            {renderTitleWithLastWordAccent(titulo)}
          </h1>
        ) : null}

        {subtitulo ? (
          <p
            className={cn(
              "max-w-4xl mx-auto text-white/90 text-center text-xl lg:text-2xl",
              mostrar_boton_contacto || mostrar_boton_calendario
                ? "mb-10"
                : "mb-40"
            )}
          >
            {subtitulo}
          </p>
        ) : null}
        {mostrar_boton_contacto || mostrar_boton_calendario ? (
          <div className="flex gap-6 md:gap-12 justify-center mb-12 flex-col sm:flex-row">
            {mostrar_boton_calendario ? (
              <Button size="lg">Agendá una consulta</Button>
            ) : null}

            {mostrar_boton_contacto ? (
              <Button variant="ghost" size="lg">
                Escribinos por WhatsApp <ArrowUpRight className="size-4 ml-2" />
              </Button>
            ) : null}
          </div>
        ) : null}

        {enumeracionItems.length ? (
          <>
            {/* Mobile: marquee */}
            <div className="md:hidden">
              <EnumeracionMarquee items={enumeracionItems} />
            </div>

            {/* Desktop (md+): keep current wrapped layout */}
            <div className="hidden md:flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              {enumeracionItems.map((texto, index) => (
                <Fragment key={`${texto}-${index}`}>
                  <p className="text-white">{texto}</p>
                  {index < enumeracionItems.length - 1 ? (
                    <span className="text-white/70" aria-hidden="true">
                      •
                    </span>
                  ) : null}
                </Fragment>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
};

export default Hero;
