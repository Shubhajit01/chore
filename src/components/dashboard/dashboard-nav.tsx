import { routeTree } from "@/routeTree.gen";
import { ToPathOption } from "@tanstack/react-router";

import BoardsIcon from "~icons/tabler/layout-kanban";
import LogoutIcon from "~icons/tabler/logout-2";
import UserIcon from "~icons/tabler/user-edit";

import { Button } from "../ui/button";
import { useLogout } from "@/hooks/use-logout";
import ThemeSwitcher from "../shared/theme-switcher";
import HomeIcon from "~icons/tabler/home";

const MENU_ITEMS = [
  // { to: "/dashboard", icon: HomeIcon, text: "Overview" },
  {
    to: "/dashboard/boards",
    icon: BoardsIcon,
    text: "Boards",
    activeIcon: BoardsIcon,
  },
  { to: "/", icon: UserIcon, text: "Profile", activeIcon: UserIcon },
] satisfies {
  text: string;
  icon: SVGComponent;
  activeIcon: SVGComponent;
  to: ToPathOption<typeof routeTree>;
}[];

export function DashboardNav() {
  return (
    <nav className="flex h-20 shrink-0 grow-0 items-center justify-between border-t dark:border-slate-600 dark:bg-slate-950/50 sm:h-screen sm:w-20 sm:flex-col sm:justify-start sm:border-r sm:!border-border sm:px-0 sm:py-6 sm:dark:border-0">
      <Link
        to="/"
        className="hidden rounded-full bg-slate-950 p-2.5 dark:bg-transparent dark:p-0 sm:block"
      >
        <img
          className="size-5 object-contain dark:size-[30px]"
          src="/images/icon-logo-dark.svg"
          width="30"
          height="30"
        />
      </Link>

      <ul className="flex grow items-center justify-around gap-4 sm:mt-12 sm:flex-col sm:justify-start">
        <li className="sm:hidden">
          <Link
            to="/"
            className="flex w-full flex-col items-center gap-0.5 p-2"
          >
            <HomeIcon className="size-6" />
            <small className="text-xs font-medium">Home</small>
          </Link>
        </li>

        {MENU_ITEMS.map((menu) => (
          <li key={menu.to} className="sm:w-full">
            <Link
              to={menu.to}
              activeProps={{ className: "text-primary dark:text-slate-100" }}
              inactiveProps={{
                className:
                  "text-slate-500 group transition-colors dark:text-slate-400",
              }}
              className="flex w-full flex-col items-center gap-0.5 p-2"
            >
              {({ isActive }) => {
                const Icon = isActive ? menu.icon : menu.icon;
                return (
                  <>
                    <Icon className="size-6 group-hover:text-slate-900 dark:group-hover:text-slate-100" />
                    <small className="text-xs font-medium">{menu.text}</small>
                  </>
                );
              }}
            </Link>
          </li>
        ))}

        <li className="order-last flex flex-col items-center gap-0.5 sm:order-none sm:mt-auto">
          <ThemeSwitcher className="h-auto border-0 sm:h-10 sm:border" />

          <small className="text-xs font-medium sm:hidden">Theme</small>
        </li>

        <li>
          <LogoutButton />
        </li>
      </ul>
    </nav>
  );
}

function LogoutButton() {
  const { isPending, logout } = useLogout();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        logout();
      }}
    >
      <Button
        size="icon"
        variant="outline"
        aria-label="Logout"
        disabled={isPending}
        className="flex h-auto flex-col gap-0.5 border-0 text-red-600 hover:text-red-700 dark:text-rose-400 dark:hover:text-rose-300 sm:h-10 sm:border"
      >
        <LogoutIcon className="size-6" />
        <small className="text-xs font-medium sm:hidden">Logout</small>
      </Button>
    </form>
  );
}
