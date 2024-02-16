import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Suspense } from "react";

import { NewBoard } from "@/components/dashboard/new-board";
import { Skeleton } from "@/components/ui/skeleton";
import { boardListItemId } from "@/lib/helpers";
import { cn } from "@/lib/utils";

import { queries } from "@/api/queries";
import ExclamationIcon from "~icons/heroicons/exclamation-triangle-solid";

export const Route = createLazyFileRoute("/dashboard/boards")({
  component: memo(function DashboardBoards() {
    return (
      <>
        <aside className="relative hidden w-80 shrink-0 grow-0 border-r p-6 [--item-h:1.75rem] dark:border-none dark:bg-slate-950/20 lg:block">
          <h1 className="scroll-m-20 text-lg font-semibold tracking-tight">
            Boards
          </h1>

          <Suspense fallback={<ListFallback />}>
            <BoardList />
          </Suspense>
        </aside>

        <Outlet />
      </>
    );
  }),
});

function ListFallback() {
  return (
    <>
      <Skeleton className="h-5 w-full"></Skeleton>

      <ul className="mt-8 space-y-1.5">
        {[...Array(10)].map((_, index) => (
          <li key={index}>
            <Skeleton className="h-[--item-h] w-full rounded border" />
          </li>
        ))}
      </ul>
    </>
  );
}

function BoardList() {
  const [parent] = useAutoAnimate();
  const { data: boards } = useSuspenseQuery(queries.boards.all());

  const canCreateNewBoard = boards.length < 10;

  return (
    <>
      <p
        className={cn(
          "text-sm font-semibold",
          boards.length === 10
            ? "text-destructive dark:text-rose-400"
            : boards.length > 5
              ? "text-amber-600 dark:text-yellow-400"
              : "text-indigo-400 text-primary",
        )}
      >
        {boards.length} of 10 boards used
      </p>

      <ul className="-ml-3 mt-8 space-y-1.5" ref={parent}>
        {boards.map((board) => (
          <li key={board.slug} className="dark:text-slate-300">
            <Link
              to="/dashboard/boards/$slug"
              params={{ slug: board.slug }}
              id={boardListItemId(board.slug)}
              activeProps={{
                className:
                  "text-primary bg-primary/5 dark:text-sky-400 dark:bg-white/5",
              }}
              inactiveProps={{
                className:
                  "hover:bg-gray-100 dark:hover:bg-slate-800/30 text-gray-600 hover:text-gray-800 dark:hover:text-white dark:text-slate-300",
              }}
              className="flex h-[--item-h] items-center gap-2 truncate rounded px-3 py-2 text-sm font-medium capitalize"
            >
              {board.name}
            </Link>
          </li>
        ))}
      </ul>

      {canCreateNewBoard ? (
        <>
          <NewBoard />
        </>
      ) : (
        <div
          role="alert"
          className="!mt-4 flex w-full gap-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm font-medium text-amber-600 dark:border-yellow-800/40 dark:bg-yellow-800/10 dark:text-yellow-300"
        >
          <div className="w-10 rounded-full bg-amber-100 p-2 dark:bg-yellow-50/5">
            <ExclamationIcon className="size-6 shrink-0" />
          </div>
          <span>You have reached maximum allowed boards.</span>
        </div>
      )}
    </>
  );
}
