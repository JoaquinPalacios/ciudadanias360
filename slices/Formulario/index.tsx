import { FC } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { richTextComponents } from "@/lib/prismic/richText";
import { FormularioForm } from "@/components/FormularioForm";

/**
 * Props for `Formulario`.
 */
export type FormularioProps = SliceComponentProps<Content.FormularioSlice>;

/**
 * Component for "Formulario" Slices.
 */
const Formulario: FC<FormularioProps> = ({ slice }) => {
  const { titulo, contenido } = slice.primary;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="px-4 py-12 lg:px-6 lg:py-20 relative overflow-hidden bg-carrara"
    >
      <div className="mx-auto w-full max-w-7xl relative z-20">
        <div className="form-card p-6 sm:p-8 lg:p-10">
          <div className="mx-auto w-full max-w-4xl">
            {titulo ? (
              <h2 className="text-finn text-balance leading-none">{titulo}</h2>
            ) : null}

            {contenido ? (
              <div className="mt-4 text-mineShaft/85 text-base lg:text-lg leading-relaxed">
                <PrismicRichText
                  field={contenido}
                  components={richTextComponents}
                />
              </div>
            ) : null}

            <FormularioForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Formulario;
