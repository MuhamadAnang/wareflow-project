"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import Loading from "../loading";
import { Paragraph } from "../typography";

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-radial-[at_52%_-52%] **:[text-shadow:0_1px_0_var(--color-primary)] border-primary from-primary/70 to-primary/95 text-primary-foreground inset-shadow-2xs inset-shadow-white/25 dark:inset-shadow-white dark:from-primary dark:to-primary/70 dark:hover:to-primary border text-sm ring-0 transition-[filter] duration-200 hover:brightness-125 active:brightness-95 dark:border-0 h-9 px-4 py-2 has-[>svg]:px-3",
        destructive:
          "bg-radial-[at_52%_-52%] **:[text-shadow:0_1px_0_var(--color-destructive)] border-destructive from-destructive/80 to-destructive/95 text-destructive-foreground inset-shadow-2xs inset-shadow-white/25 dark:inset-shadow-white dark:from-destructive dark:to-destructive/70 dark:hover:to-destructive border text-sm ring-0 transition-[filter] duration-200 hover:brightness-125 active:brightness-95 dark:border-0 h-9 px-4 py-2 has-[>svg]:px-3",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:border-muted data-[state=open]:bg-transparent",
        secondary:
          "bg-radial-[at_52%_-52%] **:[text-shadow:0_1px_0_var(--color-secondary)] border-secondary from-secondary/70 to-secondary/95 text-secondary-foreground inset-shadow-2xs inset-shadow-white/25 dark:inset-shadow-white dark:from-secondary dark:to-secondary/70 dark:hover:to-secondary border text-sm ring-0 transition-[filter] duration-200 hover:brightness-125 active:brightness-95 dark:border-0 h-9 px-4 py-2 has-[>svg]:px-3",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-7",
        "icon-lg": "size-10",
        none: "",
      },
      loadingColor: {
        default: "[&_svg[class*='lucide-loader-circle']]:text-secondary",
        destructive: "[&_svg[class*='lucide-loader-circle']]:text-white",
        outline: "[&_svg[class*='lucide-loader-circle']]:text-foreground",
        secondary: "[&_svg[class*='lucide-loader-circle']]:text-secondary-foreground",
        ghost: "[&_svg[class*='lucide-loader-circle']]:text-foreground",
        link: "[&_svg[class*='lucide-loader-circle']]:text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
      loadingColor: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "sm",
  asChild = false,
  isLoading = false,
  disabled,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, loadingColor: variant, className }))}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <Loading isFullscreen={false} />
          <Paragraph className="text-inherit">Loading...</Paragraph>
        </>
      ) : (
        children
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
