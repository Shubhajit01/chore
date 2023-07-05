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
        "scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl",
        className
      )}
    >
      {children}
    </h1>
  );
}

export function TypographyH3({
  className,
  children,
  ...props
}: ComponentProps<"h3">) {
  return (
    <h3
      {...props}
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        className
      )}
    >
      {children}
    </h3>
  );
}

export function TypographyH4({
  className,
  children,
  ...props
}: ComponentProps<"h4">) {
  return (
    <h4
      {...props}
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className
      )}
    >
      {children}
    </h4>
  );
}

export function TypographyH5({
  className,
  children,
  ...props
}: ComponentProps<"h5">) {
  return (
    <h5
      {...props}
      className={cn(
        "scroll-m-20 text-lg font-semibold tracking-tight",
        className
      )}
    >
      {children}
    </h5>
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
