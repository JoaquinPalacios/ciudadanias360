import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { StepCard } from "./components/StepCard";

/**
 * Props for `Pasos`.
 */
export type PasosProps = SliceComponentProps<Content.PasosSlice>;

/**
 * Component for "Pasos" Slices.
 */
const Pasos: FC<PasosProps> = ({ slice }) => {
  const { titulo, pasos } = slice.primary;

  const items = pasos?.filter((item) =>
    Boolean(item.paso?.trim() || item.descripcion_del_paso?.trim())
  );

  const count = items?.length ?? 0;

  const gridColsMd = count > 1 ? "md:grid-cols-2" : "md:grid-cols-1";
  const gridColsLg =
    count >= 4
      ? "lg:grid-cols-4"
      : count === 3
        ? "lg:grid-cols-3"
        : count === 2
          ? "lg:grid-cols-2"
          : "lg:grid-cols-1";

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="px-4 pb-12 pt-8 lg:px-6 lg:py-16 relative overflow-hidden bg-carrara"
    >
      <div className="mx-auto w-full max-w-8xl relative z-10">
        <div className="flex flex-col gap-6 lg:gap-10">
          {titulo ? (
            <div className="flex flex-col gap-3">
              <h2 className="text-finn leading-none text-pretty">{titulo}</h2>
              <div className="h-px w-full bg-gradient-to-r from-tussok/40 via-black/10 to-transparent" />
            </div>
          ) : null}

          {items?.length ? (
            <ol
              aria-label={titulo ? `${titulo} - pasos` : "Pasos"}
              className={`list-none grid grid-cols-1 ${gridColsMd} ${gridColsLg} gap-4 lg:gap-6`}
            >
              {items.map((item, idx) => {
                const paso = item.paso?.trim() || `Paso ${idx + 1}`;
                const descripcion = item.descripcion_del_paso?.trim();

                const stepNumber = String(idx + 1).padStart(2, "0");

                return (
                  <li key={idx}>
                    <StepCard
                      stepNumber={stepNumber}
                      title={paso}
                      description={descripcion}
                    />
                  </li>
                );
              })}
            </ol>
          ) : (
            <div className="rounded-2xl border border-black/5 bg-white/70 shadow-sm p-5 lg:p-6 text-codGray/70">
              <p className="text-base lg:text-lg">
                Próximamente agregaremos los pasos del proceso.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Pasos;
