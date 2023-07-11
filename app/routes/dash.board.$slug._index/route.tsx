import {
  ActionArgs,
  LoaderArgs,
  defer,
  json,
  redirect,
} from "@remix-run/cloudflare";
import { Await, useLoaderData, useSubmit } from "@remix-run/react";
import invariant from "tiny-invariant";

import { TypographySmall } from "~/components/ui/typography";
import getDB from "~/db";
import { relative } from "~/lib/day";
import LaneItem from "./lane-item";

import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { boards } from "~/db/schema/boards";
import { tasks } from "~/db/schema/tasks";
import Lane from "./lane";

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

export async function action({ request, context }: ActionArgs) {
  const form = await request.formData();
  const result = await z
    .object({
      id: z.string(),
      state: z.string(),
      board: z.string(),
    })
    .safeParseAsync(Object.fromEntries(form));

  if (!result.success) {
    return json(
      { ok: false, errors: result.error.formErrors.fieldErrors },
      400
    );
  }

  const { id, state, board } = result.data;

  const db = getDB(context.env.DB);

  await Promise.all([
    db
      .update(tasks)
      .set({
        stateId: state,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, id))
      .run(),
    db
      .update(boards)
      .set({ updatedAt: new Date() })
      .where(eq(boards.slug, board))
      .run(),
  ]);

  return { ok: true, errors: null };
}

export default function BoardWithSlug() {
  const { board } = useLoaderData<typeof loader>();

  const submit = useSubmit();

  const onDrop = (ev: DragEndEvent, slug: string) => {
    const active = ev.active.data.current;
    const target = ev.over?.id;

    if (!active || !target) {
      return;
    }

    const { task, laneId } = active;

    submit(
      {
        id: task.id,
        state: target,
        board: slug,
      },
      { method: "POST" }
    );
  };

  return (
    <ul className="flex gap-8 px-8 py-2 mt-32 lg:mt-0">
      <Await resolve={board}>
        {(list) => (
          <DndContext onDragEnd={(e) => onDrop(e, list.slug)}>
            {list.states.map((state) => (
              <li
                key={state.id}
                className="w-full max-w-xs shrink-0 py-2"
                style={{ "--theme": state.theme } as any}
              >
                <div className="flex items-center gap-2">
                  <div className="rounded-full w-2 h-2 bg-[--theme]" />
                  <TypographySmall className="text-white">
                    {state.name}
                  </TypographySmall>
                </div>

                <div className="relative mt-4">
                  <Lane id={state.id}>
                    {state.tasks.map((task) => (
                      <LaneItem
                        key={task.id}
                        laneId={state.id}
                        task={task}
                        final={!!state.isFinal}
                      />
                    ))}
                  </Lane>
                </div>
              </li>
            ))}
          </DndContext>
        )}
      </Await>
      <li className="h-px w-px shrink-0" />
    </ul>
  );
}
