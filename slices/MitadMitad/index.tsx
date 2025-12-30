import { FC } from "react";
import { Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicRichText } from "@prismicio/react";
import { richTextComponents } from "@/lib/prismic/richText";
import { cn } from "@/lib/utils";

/**
 * Props for `MitadMitad`.
 */
export type MitadMitadProps = SliceComponentProps<Content.MitadMitadSlice>;

/**
 * Component for "MitadMitad" Slices.
 */
const MitadMitad: FC<MitadMitadProps> = ({ slice }) => {
  const { titulo, subtitulo, cards } = slice.primary;

  const listComponents = {
    ...richTextComponents,
    list: ({ children }: { children: React.ReactNode }) => (
      <ul className="mt-3 ml-5 list-disc space-y-2 marker:text-tussok">
        {children}
      </ul>
    ),
    listItem: ({ children }: { children: React.ReactNode }) => (
      <li className="text-base lg:text-lg text-codGray/90 leading-relaxed text-pretty">
        {children}
      </li>
    ),
    oList: ({ children }: { children: React.ReactNode }) => (
      <ol className="mt-3 ml-5 list-decimal space-y-2 marker:text-tussok">
        {children}
      </ol>
    ),
    oListItem: ({ children }: { children: React.ReactNode }) => (
      <li className="text-base lg:text-lg text-codGray/90 leading-relaxed text-pretty">
        {children}
      </li>
    ),
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-carrara px-4 py-12 lg:px-6 lg:py-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        {titulo ? (
          <h2
            className={cn(
              "text-finn leading-none text-pretty",
              subtitulo ? "mb-6" : "mb-12"
            )}
          >
            {titulo}
          </h2>
        ) : null}

        {subtitulo ? (
          <p className="text-lg lg:text-xl text-codGray/90 leading-relaxed text-pretty mb-12">
            {subtitulo}
          </p>
        ) : null}
        {cards?.length ? (
          <div className="flex flex-col gap-8 lg:gap-16">
            {cards.map((card, idx) => {
              const titleText = card.titulo || titulo || undefined;
              const hasImage = Boolean(card.background_image?.url);
              const imageFirstDesktop = Boolean(card.imagen_primera);

              const textColClassName = cn(
                "order-1",
                imageFirstDesktop ? "lg:order-2" : "lg:order-1"
              );
              const imageColClassName = cn(
                "order-2",
                imageFirstDesktop ? "lg:order-1" : "lg:order-2"
              );

              return (
                <article
                  key={idx}
                  className="bg-white rounded-3xl shadow-sm ring-1 ring-black/5 overflow-hidden"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5">
                    <div
                      className={cn(
                        "p-6 max-md:pb-8 md:p-8 lg:p-10 lg:pl-12 lg:col-span-2 xl:col-span-3",
                        textColClassName
                      )}
                    >
                      {titleText ? (
                        <div className="pb-4 border-b border-quillGray">
                          <h3 className="text-finn text-2xl lg:text-4xl font-semibold leading-none text-pretty">
                            {titleText}
                          </h3>
                        </div>
                      ) : null}

                      {card.intro ? (
                        <p className="mt-4 text-base lg:text-lg text-codGray/90 leading-relaxed text-pretty max-w-prose">
                          {card.intro}
                        </p>
                      ) : null}

                      {card.titulo_seccion ? (
                        <div className="mt-7">
                          <h3 className="text-tussok font-semibold text-xl lg:text-2xl pb-2 border-b border-quillGray/70">
                            {card.titulo_seccion}
                          </h3>
                          {card.enumeracion ? (
                            <div className="mt-2">
                              <PrismicRichText
                                field={card.enumeracion}
                                components={listComponents}
                              />
                            </div>
                          ) : null}
                        </div>
                      ) : card.enumeracion ? (
                        <div className="mt-7">
                          <PrismicRichText
                            field={card.enumeracion}
                            components={listComponents}
                          />
                        </div>
                      ) : null}

                      {card.titulo_segunda_seccion ? (
                        <div className="mt-7">
                          <h3 className="text-tussok font-semibold text-xl lg:text-2xl pb-2 border-b border-quillGray/70">
                            {card.titulo_segunda_seccion}
                          </h3>
                          {card.segunda_enumeracion ? (
                            <div className="mt-2">
                              <PrismicRichText
                                field={card.segunda_enumeracion}
                                components={listComponents}
                              />
                            </div>
                          ) : null}
                        </div>
                      ) : card.segunda_enumeracion ? (
                        <div className="mt-7">
                          <PrismicRichText
                            field={card.segunda_enumeracion}
                            components={listComponents}
                          />
                        </div>
                      ) : null}
                    </div>

                    <div
                      className={cn("h-full xl:col-span-2", imageColClassName)}
                    >
                      {hasImage ? (
                        <div className="relative h-64 sm:h-80 lg:h-full lg:min-h-[420px]">
                          <PrismicNextImage
                            field={card.background_image}
                            fill
                            sizes="(min-width: 1024px) 50vw, 100vw"
                            className="object-cover"
                            loading="lazy"
                            fallbackAlt=""
                          />
                        </div>
                      ) : (
                        <div className="h-40 lg:h-full bg-quillGray/30" />
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default MitadMitad;
