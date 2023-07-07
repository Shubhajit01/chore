import * as React from "react";

import { cn } from "~/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const inputClass =
  "flex h-10 w-full rounded-md border px-3 py-2 file:border-0 file:bg-transparent file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-slate-800 bg-slate-950 ring-offset-slate-950 placeholder:text-slate-400 focus-visible:ring-slate-800";

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputClass, className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
