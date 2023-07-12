import {
  LoaderArgs,
  V2_MetaFunction,
  json,
  redirect,
} from "@remix-run/cloudflare";
import { Outlet, useLoaderData } from "@remix-run/react";
import { PlusIcon } from "lucide-react";
import invariant from "tiny-invariant";
import { Button } from "~/components/ui/button";
import { TypographyH1 } from "~/components/ui/typography";
import DATA from "~/constants/data";
import getDB from "~/db";
import { NewStage } from "../api.stage.new";
import { NewTask } from "../api.task.new";

export async function loader({ context, params: { slug } }: LoaderArgs) {
  const db = await getDB(context.env.DB);

  invariant(slug, "Please provide a slug");

  const summary = await db.query.boards.findFirst({
    where: (board, { eq }) => eq(board.slug, slug),
    columns: {
      name: true,
      id: true,
      slug: true,
    },
    with: {
      user: {
        columns: { email: true },
      },
      stages: {
        columns: { name: true, id: true },
        orderBy: (state, { asc }) => asc(state.name),
      },
    },
  });

  if (!summary) {
    throw redirect("/board");
  }

  return json({
    summary,
  });
}

export const meta: V2_MetaFunction = ({ data }) => {
  return [{ title: `${data?.summary.name} - Boards - ${DATA.APP_TITLE}` }];
};

export default function BoardWithSlug() {
  const { summary } = useLoaderData<typeof loader>();

  return (
    <div className="mt-20 flex grow flex-col lg:mt-0 lg:overflow-auto lg:pl-4">
      <header className="fixed w-full flex justify-between items-center flex-wrap gap-2 py-2 px-6 lg:py-6 lg:sticky lg:inset-0 lg:z-[21] lg:gap-0 lg:px-8 lg:backdrop-blur">
        <div className="relative -ml-4 flex w-fit items-center truncate px-4 py-2 text-center ring-white/5 hover:ring-2 lg:text-left">
          <TypographyH1>{summary.name}</TypographyH1>
        </div>

        <div className="flex items-center gap-4">
          <NewStage boardId={summary.id} />
          <NewTask
            stateItems={summary.stages.map((state) => ({
              label: state.name,
              value: state.id,
            }))}
          />
        </div>
      </header>

      <Outlet />
    </div>
  );
}
