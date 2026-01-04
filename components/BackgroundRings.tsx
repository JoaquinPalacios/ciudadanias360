import { cn } from "@/lib/utils";

type Ring = {
  className: string;
};

const CTA_RINGS: Ring[] = [
  // Large ring: bottom-right, partially off-canvas (dark section)
  {
    className:
      "absolute -bottom-8 xl:-bottom-24 2xl:-bottom-40 -right-48 md:-right-64 size-80 sm:size-96 lg:size-[32rem] 2xl:size-[48rem] rounded-full border border-tussok/8 sm:border-tussok/12 lg:border-tussok/15",
  },
  // Small accent ring: top-left (dark section)
  {
    className:
      "absolute top-3 left-3 lg:top-10 lg:left-10 size-40 md:size-56 lg:size-64 xl:size-72 rounded-full border border-tussok/8 sm:border-tussok/10 lg:border-tussok/15 2xl:border-tussok/18",
  },
];

export function BackgroundRings({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none select-none absolute inset-0",
        className
      )}
    >
      {CTA_RINGS.map((ring, idx) => (
        <div key={`cta-${idx}`} className={ring.className} />
      ))}
    </div>
  );
}
