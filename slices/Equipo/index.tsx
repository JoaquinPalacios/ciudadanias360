import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { MemberCard } from "./components/MemberCard";

/**
 * Props for `Equipo`.
 */
export type EquipoProps = SliceComponentProps<Content.EquipoSlice>;

/**
 * Component for "Equipo" Slices.
 */
const Equipo: FC<EquipoProps> = ({ slice }) => {
  const { titulo, miembro_del_equipo } = slice.primary;

  const items = miembro_del_equipo?.filter((item) =>
    Boolean(
      item.imagen?.url ||
      item.nombre?.trim() ||
      item.especialidad?.trim() ||
      item.descripcion?.trim()
    )
  );

  const count = items?.length ?? 0;
  const gridColsMd = count > 1 ? "md:grid-cols-2" : "md:grid-cols-1";
  const gridColsLg = count >= 3 ? "lg:grid-cols-3" : "lg:grid-cols-2";

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="relative overflow-hidden bg-carrara"
    >
      <div className="mx-auto w-full max-w-8xl relative z-10 px-4 pb-12 pt-8 lg:px-6 lg:py-16">
        <div className="flex flex-col gap-6 lg:gap-10">
          {titulo ? (
            <div className="flex flex-col gap-3">
              <h2 className="text-finn leading-none text-pretty">{titulo}</h2>
              <div className="h-px w-full bg-gradient-to-r from-tussok/40 via-black/10 to-transparent" />
            </div>
          ) : null}

          {items?.length ? (
            <ul
              aria-label={titulo ? `${titulo} - miembros` : "Equipo"}
              className={`grid grid-cols-1 ${gridColsMd} ${gridColsLg} gap-4 lg:gap-6`}
            >
              {items.map((item, idx) => {
                return (
                  <li key={idx}>
                    <MemberCard
                      image={item.imagen}
                      name={item.nombre}
                      specialty={item.especialidad}
                      description={item.descripcion}
                    />
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="rounded-2xl border border-black/5 bg-white/70 shadow-sm p-5 lg:p-6 text-codGray/70">
              <p className="text-base lg:text-lg">
                Próximamente agregaremos miembros del equipo.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Equipo;
