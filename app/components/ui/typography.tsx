import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";

export function TypographyH1({
  className,
  children,
  ...props
}: ComponentProps<"h1">) {
  return (
    <h1
      {...props}
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        className
      )}
    >
      {children}
    </h1>
  );
}

export function TypographySmall({
  className,
  children,
  ...props
}: ComponentProps<"small">) {
  return (
    <small
      {...props}
      className={cn("text-sm font-medium leading-none", className)}
    >
      {children}
    </small>
  );
}
