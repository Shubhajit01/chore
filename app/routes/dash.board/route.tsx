import { LoaderArgs, V2_MetaFunction, json } from "@remix-run/cloudflare";
import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { TypographyH5 } from "~/components/ui/typography";
import DATA from "~/constants/data";
import getDB from "~/db";
import { cn } from "~/lib/utils";
import { NewBoard } from "../api.board.new";

export async function loader({ context }: LoaderArgs) {
  const db = getDB(context.env.DB);

  return json(
    await db.query.users
      .findFirst({
        columns: { id: true },
        where: (users, { eq }) => eq(users.email, "shubhajit@chore.com"),
        with: {
          boards: {
            columns: { name: true, slug: true, updatedAt: true },
            orderBy: (board, { desc }) => [desc(board.updatedAt)],
          },
        },
      })
      .then((list) => ({
        ...list,
        boards:
          list?.boards.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)) ??
          [],
      }))
  );
}

export const meta: V2_MetaFunction = () => [
  { title: `Boards - ${DATA.APP_TITLE}` },
];

export default function BoardLayout() {
  const { boards } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="hidden w-[18rem] shrink-0 overflow-hidden border-r border-gray-800/40 bg-black/10 py-6 px-8 duration-100 lg:block overflow-y-auto">
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
                    to={`/dash/board/${board.slug}`}
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

        <div className="mt-8">
          <NewBoard />
        </div>
      </div>
      <Outlet />
    </>
  );
}
