import { forwardRef, useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { cn } from "~/lib/utils";
import { inputClass } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type WithColor = {
  color: string;
  onColorChange: (color: string) => void;
};

type WithoutColor = {
  color?: undefined;
  onColorChange?: never;
};

export type ButtonProps = React.InputHTMLAttributes<HTMLInputElement> &
  (WithColor | WithoutColor);

export default forwardRef<HTMLInputElement, ButtonProps>(function ColorInput(
  { color, onColorChange, ...props },
  ref
) {
  const [value, setValue] = useState("#7efbbb");

  const currentValue = color ?? value;
  const setCurrentValue = onColorChange ?? setValue;

  return (
    <fieldset className="relative">
      <Popover>
        <PopoverTrigger
          aria-label="Choose color"
          className="absolute left-2.5 top-2/4 -translate-y-2/4 w-6 h-6 rounded"
          style={{ backgroundColor: currentValue }}
        />
        <PopoverContent className="space-y-4 w-[14.5rem]">
          <HexColorPicker
            className="w-full"
            color={currentValue}
            onChange={setCurrentValue}
          />
        </PopoverContent>
      </Popover>

      <HexColorInput
        {...props}
        className={cn(inputClass, "pl-11 max-w-[8rem]")}
        placeholder='say "ffffff" without the "#"'
        color={currentValue}
        onChange={setCurrentValue}
      />
    </fieldset>
  );
});
