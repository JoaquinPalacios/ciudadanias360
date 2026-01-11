import { FC, Fragment } from "react";
import { Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { EnumeracionMarquee } from "./components/EnumeracionMarquee";
import { RevealOnce } from "./components/RevealOnce";

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
const Hero: FC<HeroProps> = ({ slice }) => {
  const { titulo, subtitulo, background_image } = slice.primary;

  const isImpactoMedio = slice.variation === "impactoMedio";

  const hasCtasAndEnumeracion = (
    primary: HeroProps["slice"]["primary"]
  ): primary is Content.HeroSliceDefaultPrimary => {
    return (
      "mostrar_boton_contacto" in primary ||
      "mostrar_boton_calendario" in primary ||
      "enumeracion" in primary
    );
  };

  const primaryWithCtas = hasCtasAndEnumeracion(slice.primary)
    ? slice.primary
    : null;

  const mostrar_boton_contacto =
    primaryWithCtas?.mostrar_boton_contacto ?? false;
  const mostrar_boton_calendario =
    primaryWithCtas?.mostrar_boton_calendario ?? false;

  const enumeracionItems = (primaryWithCtas?.enumeracion ?? [])
    .map((item) => item.texto)
    .filter((v): v is string => Boolean(v && v.trim()));

  const showCtas =
    !isImpactoMedio && (mostrar_boton_contacto || mostrar_boton_calendario);

  const showEnumeracion = !isImpactoMedio && enumeracionItems.length > 0;

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
      className="px-4 pb-12 pt-32 lg:px-6 lg:pb-16 lg:pt-40 relative overflow-hidden bg-tamarind -mt-20"
    >
      {/* Background image (optional) */}
      {background_image?.url ? (
        <div
          className="absolute inset-0 top-20 z-0 pointer-events-none select-none"
          aria-hidden="true"
        >
          <PrismicNextImage
            field={background_image}
            fill
            sizes="100vw"
            className="object-cover"
            fallbackAlt=""
            loading="eager"
            fetchPriority="high"
          />
          {/* Finn overlay to blend image into the section background */}
          <div className="absolute inset-0 bg-linear-to-b from-finn/40 via-finn/80 to-finn z-10" />
        </div>
      ) : null}

      {/* background pattern */}
      <div
        className="absolute inset-0 top-20 opacity-10 lg:opacity-15 z-10 pointer-events-none select-none"
        aria-hidden="true"
      >
        <div
          className={cn(
            "absolute top-20 left-20 border-2 border-tussok rounded-full",
            isImpactoMedio ? "size-28 lg:size-60" : "size-32 lg:size-64"
          )}
        />
        <div
          className={cn(
            "absolute bottom-20 right-20 border-2 border-tussok rounded-full",
            isImpactoMedio ? "size-40 lg:size-72" : "size-48 lg:size-96"
          )}
        />
        <div
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-white rounded-full",
            isImpactoMedio
              ? "size-56 lg:size-[30rem]"
              : "size-72 lg:size-[37.5rem]"
          )}
        />
      </div>
      <RevealOnce className="mx-auto flex w-full max-w-8xl flex-col lg:gap-6 relative z-20 mt-40 md:mt-48 lg:mt-60 mb-6 lg:mb-10">
        {titulo ? (
          <h1
            className="hero-reveal-item text-white text-center max-w-5xl mx-auto leading-none mb-8 lg:mb-10"
            style={{ "--hero-reveal-delay": "0ms" } as React.CSSProperties}
          >
            {renderTitleWithLastWordAccent(titulo)}
          </h1>
        ) : null}

        {subtitulo ? (
          <p
            className={cn(
              "hero-reveal-item max-w-4xl mx-auto text-white/90 text-center text-xl lg:text-2xl",
              showCtas ? "mb-10" : "mb-40"
            )}
            style={{ "--hero-reveal-delay": "100ms" } as React.CSSProperties}
          >
            {subtitulo}
          </p>
        ) : null}
        {showCtas ? (
          <div
            className="hero-reveal-item flex gap-6 md:gap-12 justify-center mb-12 flex-col sm:flex-row"
            style={{ "--hero-reveal-delay": "200ms" } as React.CSSProperties}
          >
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

        {showEnumeracion ? (
          <div
            className="hero-reveal-item"
            style={{ "--hero-reveal-delay": "300ms" } as React.CSSProperties}
          >
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
          </div>
        ) : null}
      </RevealOnce>
    </section>
  );
};

export default Hero;
