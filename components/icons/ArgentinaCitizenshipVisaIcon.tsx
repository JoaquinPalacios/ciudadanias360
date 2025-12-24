import { FileText, SunDim } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

/**
 * Combined icon to represent Argentina-related citizenship + visas.
 * Uses a document (citizenship) base with a small badge evoking Argentina + travel (visas).
 */
export const ArgentinaCitizenshipVisaIcon = ({ className }: Props) => {
  return (
    <span
      className={cn("relative inline-block size-6 shrink-0", className)}
      aria-hidden="true"
    >
      <FileText
        className="absolute inset-0 size-full text-tussok"
        strokeWidth={1}
      />
      <span className="absolute -bottom-1 -right-1 grid size-4 place-items-center rounded-full z-10 bg-white">
        <SunDim className="size-4 text-tussok" />
      </span>
    </span>
  );
};
