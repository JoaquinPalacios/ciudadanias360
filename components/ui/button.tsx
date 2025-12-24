import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/utilities/ui";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded font-medium ring-offset-background transition-colors duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 cursor-pointer",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        clear: "",
        default: "h-10 px-4 py-3",
        icon: "h-10 w-10",
        lg: "h-11 lg:h-12 rounded px-5 lg:px-8",
        sm: "h-9 rounded px-3",
        xs: "h-8 rounded max-md:text-sm px-2.5 lg:px-3",
        full: "h-10 w-full px-4 py-2",
      },
      variant: {
        default:
          "relative overflow-hidden border-0 rounded-lg bg-tussok text-codGray shadow-[1px_1px_2px_0_rgba(0,0,0,0.2)] no-underline text-base transition-[transform,box-shadow,filter] duration-300 ease-out before:absolute before:inset-0 before:rounded-2xl before:bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_55%)] before:opacity-0 before:transition-opacity before:duration-300 after:absolute after:inset-0 after:rounded-lg after:bg-[linear-gradient(115deg,transparent,rgba(255,255,255,0.35),transparent)] after:translate-x-[-120%] after:transition-transform after:duration-700 after:ease-out hover:shadow-[0_10px_24px_rgba(0,0,0,0.18)] hover:brightness-105 hover:before:opacity-100 hover:after:translate-x-[120%] active:scale-[0.99] active:brightness-95 focus-visible:ring-[rgba(0,0,0,0.22)]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        ghost:
          "relative overflow-hidden border border-tussok/55 rounded-lg bg-transparent text-tussok shadow-none transition-[transform,background-color,border-color,box-shadow,color] duration-300 ease-out before:absolute before:inset-0 before:rounded-lg before:bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.22),transparent_60%)] before:opacity-0 before:transition-opacity before:duration-300 after:absolute after:inset-0 after:rounded-lg after:bg-[linear-gradient(115deg,transparent,rgba(255,255,255,0.25),transparent)] after:translate-x-[-130%] after:transition-transform after:duration-700 after:ease-out hover:bg-tussok/12 hover:border-tussok hover:text-white hover:shadow-[0_12px_28px_rgba(190,158,68,0.22)] hover:before:opacity-100 hover:after:translate-x-[130%] active:scale-[0.99] active:bg-tussok/18 focus-visible:ring-[rgba(190,158,68,0.55)]",
        link: "items-start justify-start relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full",
        outline:
          "relative overflow-hidden border border-asfalto before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-[linear-gradient(90deg,transparent,rgba(0,0,0,0.06),transparent)] before:transition-all before:duration-300 hover:before:left-full hover:bg-asfalto/10 transition-colors duration-200 focus-visible:ring-[rgba(60,60,60,0.55)] focus:ring-[rgba(60,60,60,0.55)] active:shadow-[inset_0_1px_3px_rgba(0,0,0,0.18)] active:bg-asfalto/15 active:before:transition-none active:before:left-0",
        secondary:
          "relative overflow-hidden bg-brisa-de-ruta border border-brisa-de-ruta text-white after:absolute after:top-0 after:-left-full after:w-full after:h-full after:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)] after:transition-all after:duration-300 hover:after:left-full hover:shadow-[0_2px_8px_rgba(132,191,216,0.35)] focus-visible:ring-[rgba(100,150,180,0.6)] focus:ring-[rgba(100,150,180,0.6)] active:shadow-[inset_0_1px_3px_rgba(0,0,0,0.15)] active:bg-brisa-de-ruta/90 active:after:transition-none active:after:left-0",
      },
    },
  }
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, className, size, variant, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ className, size, variant }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
