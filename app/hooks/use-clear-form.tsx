import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";

export default function useClearForm<T extends FieldValues>({
  open,
  form,
}: {
  open: boolean;
  form: ReturnType<typeof useForm<T>>;
}) {
  useEffect(() => {
    let timer: number | undefined;

    if (!open) {
      timer = window.setTimeout(() => form.reset(), 300);
    }

    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, [open]);
}
