import {
  ActionArgs,
  LoaderArgs,
  defer,
  json,
  redirect,
} from "@remix-run/cloudflare";
import { Await, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import getDB from "~/db";
import { relative } from "~/lib/day";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { boards } from "~/db/schema/boards";
import { tasks } from "~/db/schema/tasks";
import Board from "./board";

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
  const { board: awaitableBoard } = useLoaderData<typeof loader>();

  return (
    <ul className="flex gap-8 px-8 py-2 mt-32 lg:mt-0">
      <Await resolve={awaitableBoard}>{(list) => <Board data={list} />}</Await>
      <li className="h-px w-px shrink-0" />
    </ul>
  );
}
