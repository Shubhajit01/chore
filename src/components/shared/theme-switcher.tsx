import useDarkMode from "use-dark-mode";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { Button, ButtonProps } from "../ui/button";

const ThemeSwitcher = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const darkMode = useDarkMode(false, {
      classNameDark: "dark",
      classNameLight: "light",
    });

    useEffect(() => {
      document.documentElement.style.colorScheme = darkMode.value
        ? "dark"
        : "light";
    }, [darkMode.value]);

    return (
      <Button
        ref={ref}
        variant="outline"
        size="icon"
        className="rounded-full bg-white text-white dark:bg-background"
        title="Toggle theme"
        {...props}
        onClick={() => darkMode.toggle()}
      >
        <DarkModeSwitch
          className="size-6"
          checked={darkMode.value}
          onChange={darkMode.toggle}
          size={120}
        />
      </Button>
    );
  },
);

export default ThemeSwitcher;
