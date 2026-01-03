import { FC } from "react";

type StepCardProps = {
  stepNumber: string;
  title: string;
  description?: string | null;
};

export const StepCard: FC<StepCardProps> = ({
  stepNumber,
  title,
  description,
}) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-black/5 bg-white/70 shadow-xs transition-all duration-200 hover:shadow h-full">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-tussok/70 via-laser/35 to-transparent" />

      <div className="p-5 lg:p-6">
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            <div className="grid place-items-center h-11 w-11 rounded-2xl border border-tussok/30 bg-laser/18 text-finn font-semibold tracking-tight shadow-sm">
              {stepNumber}
            </div>
          </div>

          <div className="flex flex-col gap-2 min-w-0">
            <h3 className="text-base lg:text-lg font-semibold text-codGray leading-snug text-pretty">
              {title}
            </h3>

            {description ? (
              <p className="text-sm lg:text-base text-codGray/80 leading-relaxed text-pretty">
                {description}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-laser/15 blur-2xl opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
    </div>
  );
};
