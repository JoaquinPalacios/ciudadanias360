import { FC } from "react";
import { ImageField } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";

type MemberCardProps = {
  image?: ImageField;
  name?: string | null;
  specialty?: string | null;
  description?: string | null;
};

export const MemberCard: FC<MemberCardProps> = ({
  image,
  name,
  specialty,
  description,
}) => {
  const nombre = name?.trim();
  const especialidad = specialty?.trim();
  const descripcion = description?.trim();

  const initials = (nombre || "Equipo")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <div className="relative overflow-hidden rounded-2xl border border-black/5 bg-white/70 shadow-xs transition-all duration-200 hover:shadow">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-tussok/70 via-laser/35 to-transparent" />

      <div className="p-5 lg:p-6">
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            {image?.url ? (
              <div className="relative size-20 overflow-hidden rounded-full bg-carrara border border-black/5">
                <PrismicNextImage
                  field={image}
                  fallbackAlt=""
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            ) : (
              <div className="grid place-items-center size-16 rounded-full bg-laser/18 border border-tussok/25 text-finn font-semibold">
                {initials || "?"}
              </div>
            )}
          </div>

          <div className="min-w-0 flex flex-col gap-2">
            {nombre ? (
              <p className="text-finn md:text-lg font-semibold leading-none text-pretty">
                {nombre}
              </p>
            ) : (
              <p className="text-finn md:text-lg font-semibold leading-none text-pretty">
                Miembro del equipo
              </p>
            )}

            {especialidad ? (
              <p className="text-tussok text-pretty leading-snug">
                {especialidad}
              </p>
            ) : null}

            {descripcion ? (
              <p className="text-sm lg:text-base text-codGray/80 leading-relaxed text-pretty">
                {descripcion}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
