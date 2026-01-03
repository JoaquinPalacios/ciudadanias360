import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { Check } from "lucide-react";

/**
 * Props for `Lista`.
 */
export type ListaProps = SliceComponentProps<Content.ListaSlice>;

/**
 * Component for "Lista" Slices.
 */
const Lista: FC<ListaProps> = ({ slice }) => {
  const { titulo, lista } = slice.primary;

  const items = lista?.filter((item) => Boolean(item.texto?.trim()));

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="px-4 py-12 lg:px-6 lg:py-16 relative overflow-hidden bg-carrara"
    >
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <div className="absolute bottom-0 -right-24 h-72 w-72 rounded-full bg-tussok/15 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-8xl relative z-10">
        <div className="flex flex-col gap-6 lg:gap-10">
          {titulo ? (
            <div className="flex flex-col gap-3">
              <h2 className="text-finn leading-none text-pretty">{titulo}</h2>
              <div className="h-px w-full bg-gradient-to-r from-tussok/40 via-black/10 to-transparent" />
            </div>
          ) : null}

          {items?.length ? (
            <div className="w-full max-w-4xl">
              <div className="relative overflow-hidden rounded-2xl border border-black/5 bg-white/70 shadow-xs">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-tussok/70 via-laser/35 to-transparent" />

                <ul
                  aria-label={titulo ? `${titulo} - lista` : "Lista"}
                  className="divide-y divide-black/5"
                >
                  {items.map((item, idx) => {
                    const texto = item.texto?.trim();
                    if (!texto) return null;

                    return (
                      <li
                        key={idx}
                        className="flex gap-3 p-5 lg:p-6 items-center"
                      >
                        <Check
                          className="mt-0.5 size-5 shrink-0 text-tussok"
                          aria-hidden="true"
                        />
                        <p className="text-base lg:text-lg text-codGray/90 leading-relaxed text-pretty">
                          {texto}
                        </p>
                      </li>
                    );
                  })}
                </ul>

                <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-laser/15 blur-2xl opacity-70" />
              </div>
            </div>
          ) : (
            <div className="w-full max-w-4xl rounded-2xl border border-black/5 bg-white/70 shadow-sm p-5 lg:p-6 text-codGray/70">
              <p className="text-base lg:text-lg">
                Próximamente agregaremos esta lista.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Lista;
