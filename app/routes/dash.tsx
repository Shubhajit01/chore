import { NavLink, Outlet } from "@remix-run/react";
import { KanbanIcon, UserCircle, LogOutIcon } from "lucide-react";
import { BiHomeAlt2 } from "react-icons/bi";
import { cn } from "~/lib/utils";

export default function DashRoute() {
  const navLinks = [
    { label: "Home", icon: BiHomeAlt2, to: "/" },
    { label: "Boards", icon: KanbanIcon, to: "/dash/board" },
    { label: "Profile", icon: UserCircle, to: "/dash/me" },
  ];

  return (
    <main className="flex min-h-screen w-screen flex-col lg:h-screen lg:flex-row">
      <aside className="hidden lg:flex w-20 pt-11 pb-6 flex-col bg-black/30">
        <div className="px-6 grow-0">
          <img
            src="/icon-logo.svg"
            width="30"
            height="27"
            alt="A slanted grid symbol is displayed on the left side, featuring three columns with sky, white, and sky background colors respectively."
          />
        </div>

        <ul className="flex flex-col grow items-center gap-5 mt-10">
          {navLinks.map((link) => (
            <li key={link.to} className="w-full">
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col w-full gap-0.5 items-center",
                    isActive ? "text-white" : "text-slate-500"
                  )
                }
              >
                <link.icon className="w-6 h-6" />
                <small className="text-xs font-medium">{link.label}</small>
              </NavLink>
            </li>
          ))}

          {/* <li className="mt-auto flex w-full flex-col gap-0.5 items-center text-rose-400">
            <LogOutIcon className="w-6 h-6" />
            <small className="text-xs font-medium">Logout</small>
          </li> */}
        </ul>
      </aside>

      <Outlet />
    </main>
  );
}
