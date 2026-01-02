import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/utilities/ui";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      "rounded-xl border border-black/5 bg-white/70 shadow-sm",
      "focus-within:ring-2 focus-within:ring-tussok/30 focus-within:ring-offset-2 focus-within:ring-offset-carrara",
      className
    )}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "group flex flex-1 items-start justify-between gap-4 rounded-xl px-5 py-4 text-left",
        "text-base md:text-lg font-semibold text-finn leading-snug text-pretty",
        "transition-colors hover:text-finn/85 focus-visible:outline-none",
        className
      )}
      {...props}
    >
      <span className="min-w-0">{children}</span>
      <ChevronDown
        className={cn(
          "mt-1 size-5 shrink-0 text-tussok transition-transform duration-300",
          "group-data-[state=open]:rotate-180"
        )}
        aria-hidden="true"
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      // Keep padding on an inner wrapper so the height animation is smooth.
      // (Padding on the animated element can feel “steppy” when collapsing.)
      "overflow-hidden will-change-[height]",
      "data-[state=open]:animate-[accordion-down_280ms_cubic-bezier(0.16,1,0.3,1)]",
      "data-[state=closed]:animate-[accordion-up_240ms_cubic-bezier(0.7,0,0.84,0)]",
      className
    )}
    {...props}
  >
    <div className="px-5 pb-5 text-base md:text-lg text-codGray/85 leading-relaxed text-pretty">
      {children}
    </div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
