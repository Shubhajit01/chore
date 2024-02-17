import { cn } from "@/lib/utils";
import { Toaster as Sonner, toast as showToast } from "sonner";
import useDarkMode from "use-dark-mode";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export const toast = showToast;

const Toaster = ({ ...props }: ToasterProps) => {
  const isDarkMode = useDarkMode();

  return (
    <Sonner
      className="toaster group"
      theme={isDarkMode ? "dark" : "light"}
      toastOptions={{
        classNames: {
          title: "group font-sans !text-base !font-medium",
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:items-start",
          description:
            "group-[.toast]:text-muted-foreground group-[.toast]:text-sm group-[.toast]:font-sans",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

const ToastIcon = ({
  icon: Icon,
  type,
}: {
  icon: SVGComponent;
  type: "success" | "faiilure";
}) => {
  return (
    <Icon
      className={cn(
        "mt-2 size-5",
        type === "success" && "text-teal-500",
        type === "faiilure" && "text-destructive",
      )}
    />
  );
};

export { Toaster, ToastIcon };
