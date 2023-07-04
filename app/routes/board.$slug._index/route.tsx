import { LoaderArgs, defer, redirect } from "@remix-run/cloudflare";
import { Await, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { TypographySmall } from "~/components/ui/typography";
import getDB from "~/db";
import { relative } from "~/lib/day";
import LaneItem from "./lane-item";

export async function loader({ context, params: { slug } }: LoaderArgs) {
  const db = getDB(context.env.DB);

  invariant(slug, "Please provide a slug");

  return defer({
    board: getBoard(db, slug),
  });
}

async function getBoard(db: ReturnType<typeof getDB>, slug: string) {
  const board = await db.query.boards.findFirst({
    where: (boards, { eq }) => eq(boards.slug, slug),
    columns: {
      id: true,
      slug: true,
    },
    with: {
      states: {
        columns: {
          id: true,
          name: true,
          theme: true,
          isFinal: true,
        },
        with: {
          tasks: {
            columns: {
              title: true,
              updatedAt: true,
              id: true,
              description: true,
            },
            orderBy: (task, { desc }) => desc(task.updatedAt),
          },
        },
        orderBy: (state, { asc }) => asc(state.updatedAt),
      },
    },
  });

  if (!board) {
    throw redirect("/login");
  }

  return {
    ...board,
    states: board.states.map((state) => ({
      ...state,
      tasks: state.tasks.map((task) => ({
        ...task,
        updatedAt: relative(task.updatedAt),
      })),
    })),
  };
}

export default function BoardWithSlug() {
  const { board } = useLoaderData<typeof loader>();

  return (
    <ul className="flex gap-8 px-8 py-2 mt-32 lg:mt-0">
      <Await resolve={board}>
        {(list) => (
          <>
            {list.states.map((state) => (
              <li key={state.id} className="w-full max-w-xs shrink-0 py-2">
                <div>
                  <TypographySmall>{state.name}</TypographySmall>
                </div>

                <div className="relative mt-2">
                  <ul
                    className="single-lane group space-y-4"
                    style={{ "--theme": state.theme } as any}
                  >
                    {state.tasks.map((task) => (
                      <LaneItem
                        key={task.id}
                        laneId={state.id}
                        task={task}
                        final={!!state.isFinal}
                      />
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </>
        )}
      </Await>
      <li className="h-px w-px shrink-0" />
    </ul>
  );
}
