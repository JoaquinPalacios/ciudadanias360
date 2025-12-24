import { FC, Fragment } from "react";
import { Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

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
      className="px-6 py-16 relative overflow-hidden"
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
        className="absolute inset-0 opacity-15 z-10 pointer-events-none select-none"
        aria-hidden="true"
      >
        <div className="absolute top-20 left-20 w-64 h-64 border-2 border-tussok rounded-full" />
        <div className="absolute bottom-20 right-20 w-96 h-96 border-2 border-tussok rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white rounded-full" />
      </div>
      <div className="mx-auto flex w-full max-w-8xl flex-col gap-6 relative z-20 mt-40 mb-10">
        {titulo ? (
          <h1 className="text-white text-center max-w-5xl mx-auto leading-none mb-10">
            {renderTitleWithLastWordAccent(titulo)}
          </h1>
        ) : null}

        {subtitulo ? (
          <p
            className={cn(
              "max-w-4xl mx-auto text-white/90 text-center text-2xl",
              mostrar_boton_contacto || mostrar_boton_calendario
                ? "mb-10"
                : "mb-40"
            )}
          >
            {subtitulo}
          </p>
        ) : null}
        {mostrar_boton_contacto || mostrar_boton_calendario ? (
          <div className="flex gap-12 justify-center mb-12">
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

        {enumeracion?.length ? (
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {enumeracion.map((item, index) => (
              <Fragment key={index}>
                <p className="text-white">{item.texto}</p>
                {index < enumeracion.length - 1 ? (
                  <span className="text-white/70" aria-hidden="true">
                    •
                  </span>
                ) : null}
              </Fragment>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default Hero;
