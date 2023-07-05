import { LoaderArgs, json } from "@remix-run/cloudflare";
import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { HomeIcon, KanbanIcon, LogOutIcon } from "lucide-react";
import { TypographyH4, TypographyH5 } from "~/components/ui/typography";
import getDB from "~/db";
import { cn } from "~/lib/utils";

export async function loader({ context }: LoaderArgs) {
  const db = await getDB(context.env.DB);

  return json(
    await db.query.users.findFirst({
      columns: { id: true },
      where: (users, { eq }) => eq(users.email, "shubhajit@chore.com"),
      with: {
        boards: {
          columns: { name: true, slug: true, updatedAt: true },
          orderBy: (board, { desc }) => [desc(board.updatedAt)],
        },
      },
    })
  );
}

export default function BoardLayout() {
  const { boards } = useLoaderData<typeof loader>();

  const navLinks = [
    { label: "Home", icon: HomeIcon, to: "/" },
    { label: "Boards", icon: KanbanIcon, to: "/board" },
  ];

  return (
    <main className="flex min-h-screen w-screen flex-col lg:h-screen lg:flex-row">
      <aside className="hidden lg:flex w-20 pt-11 pb-6 flex-col bg-black/30">
        <div className="px-6 grow-0">
          <img src="/icon-logo.svg" />
        </div>

        <ul className="flex flex-col grow items-center gap-5 mt-10 text-slate-500">
          {navLinks.map((link) => (
            <li key={link.to} className="w-full">
              <NavLink
                to={link.to}
                className="flex flex-col w-full gap-1 items-center"
              >
                <link.icon className="w-6 h-6" />
                <small className="text-xs font-medium text-slate-500">
                  {link.label}
                </small>
              </NavLink>
            </li>
          ))}

          <li className="mt-auto flex w-full flex-col gap-1 items-center">
            <LogOutIcon className="w-6 h-6" />
            <small className="text-xs font-medium">Logout</small>
          </li>
        </ul>
      </aside>

      <div className="hidden w-[18rem] shrink-0 overflow-hidden border-r border-gray-800/40 bg-black/10 py-6 px-8 duration-100 lg:block">
        <div className="mt-5 mb-3">
          <TypographyH5>
            Boards (<span>{boards.length}/10</span>)
          </TypographyH5>
        </div>

        <nav>
          <ul className="space-y-1">
            {boards.map((board) => {
              return (
                <li key={board.slug} className="py-0.5 text-slate-300">
                  <NavLink
                    prefetch="intent"
                    to={`/board/${board.slug}`}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2 truncate font-medium",
                        isActive ? "text-sky-400" : "hover:text-white"
                      )
                    }
                  >
                    {board.name}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <Outlet />
    </main>
  );
}
