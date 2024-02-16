import { queries } from "@/api/queries";
import { BoardLane } from "@/components/dashboard/board-lane";
import { BoardLaneZone } from "@/components/dashboard/board-lane-zone";
import { EditableBoardHeading } from "@/components/dashboard/editable-board-heading";
import { NewStage } from "@/components/dashboard/new-stage";
import { NewTask } from "@/components/dashboard/new-task";
import { TaskCard } from "@/components/dashboard/task-card";
import { Suspense } from "react";

const EmptyBoard = lazy(() =>
  import("@/components/dashboard/empty-board").then((m) => ({
    default: m.EmptyBoard,
  })),
);

export const Route = createLazyFileRoute("/dashboard/boards/$slug")({
  component: memo(function BoardWithSlug() {
    const { slug } = Route.useParams();

    const { data: board } = useSuspenseQuery(queries.boards.slug(slug));

    if (!board) {
      return <div>Not found</div>;
    }

    return (
      <>
        <div className="flex grow flex-col gap-8 overflow-hidden px-8 pt-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
            <EditableBoardHeading slug={board.slug} value={board.name} />
          </div>

          {board.stages.length ? (
            <div className="flex flex-col items-stretch gap-4 border-y py-4 min-[315px]:flex-row min-[315px]:items-center md:border-0 md:py-0">
              <NewStage boardId={board.id} boardSlug={board.slug} />
              <NewTask
                stages={board.stages.map((stage) => ({
                  label: stage.name,
                  value: stage.id,
                }))}
              />
            </div>
          ) : null}

          <div className="h-full overflow-auto">
            {board.stages.length ? (
              <BoardLaneZone columnLength={board.stages.length}>
                {board.stages.map((stage) => (
                  <BoardLane
                    key={stage.name}
                    name={stage.name}
                    stageId={stage.id}
                    boardSlug={board.slug}
                    isFinal={!!stage.is_final}
                  >
                    {stage.tasks.map((task) => (
                      <TaskCard
                        key={task.slug}
                        stageId={stage.id}
                        boardSlug={board.slug}
                        {...task}
                      />
                    ))}
                  </BoardLane>
                ))}
              </BoardLaneZone>
            ) : (
              <Suspense>
                <EmptyBoard title={board.name}>
                  <NewStage empty boardId={board.id} boardSlug={board.slug} />
                </EmptyBoard>
              </Suspense>
            )}
          </div>
        </div>

        <Outlet />
      </>
    );
  }),
});
