import { LoaderArgs, json } from "@remix-run/cloudflare";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { TypographySmall } from "~/components/ui/typography";
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

  return (
    <main className="flex min-h-screen w-screen flex-col lg:h-screen lg:flex-row">
      <div className="hidden w-full max-w-[18rem] shrink-0 overflow-hidden border-r border-gray-800/40 bg-black/10 p-6 duration-100 lg:block">
        <Link to="/" aria-label="Go to homepage">
          <img src="/logo.svg" alt="" width="125" height="43" />
        </Link>

        <div className="mb-2 mt-8 block">
          <small className="text-xs font-semibold uppercase leading-none text-slate-400">
            Boards (<span>{boards.length}/10</span>)
          </small>
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
