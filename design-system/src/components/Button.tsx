import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default:     "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline:     "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
        secondary:   "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:       "hover:bg-accent hover:text-accent-foreground",
        link:        "text-primary underline-offset-4 hover:underline",
        cta:         "bg-hp-orange text-white rounded-full font-extrabold active:scale-[0.98] transition-transform",
        purple:      "bg-hp-purple-deep text-white rounded-full font-extrabold active:scale-[0.98] transition-transform",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm:      "h-8 rounded-md gap-1.5 px-3",
        lg:      "h-10 rounded-md px-6",
        xl:      "h-14 rounded-full px-8 text-base",
        icon:    "size-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size:    "default",
    },
  },
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { buttonVariants };
