import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/**
 * Props for `PreguntasFrecuentes`.
 */
export type PreguntasFrecuentesProps =
  SliceComponentProps<Content.PreguntasFrecuentesSlice>;

/**
 * Component for "PreguntasFrecuentes" Slices.
 */
const PreguntasFrecuentes: FC<PreguntasFrecuentesProps> = ({ slice }) => {
  const { titulo, texto, preguntas_frecuentes } = slice.primary;

  const items = preguntas_frecuentes?.filter((item) =>
    Boolean(item.pregunta || item.respuesta)
  );

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="px-4 pb-12 pt-8 lg:px-6 lg:py-16 relative overflow-hidden bg-carrara"
    >
      <div className="mx-auto w-full max-w-7xl relative z-20">
        <div className="flex flex-col gap-4 lg:gap-6">
          {titulo ? (
            <h2 className="text-finn leading-none text-pretty">{titulo}</h2>
          ) : null}

          {texto ? (
            <p className="text-base lg:text-lg text-codGray/85 leading-relaxed text-pretty mb-6">
              {texto}
            </p>
          ) : null}

          {items?.length ? (
            <Accordion
              type="single"
              collapsible
              className="flex flex-col gap-4"
            >
              {items.map((item, idx) => {
                const pregunta = item.pregunta?.trim() || `Pregunta ${idx + 1}`;
                const respuesta = item.respuesta?.trim();

                return (
                  <AccordionItem key={idx} value={`faq-${idx}`}>
                    <AccordionTrigger>{pregunta}</AccordionTrigger>
                    <AccordionContent>
                      {respuesta ? <p>{respuesta}</p> : null}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          ) : (
            <div className="rounded-xl border border-black/5 bg-white/70 shadow-sm p-5 text-codGray/70">
              <p className="text-base md:text-lg">
                Próximamente agregaremos preguntas frecuentes.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PreguntasFrecuentes;
