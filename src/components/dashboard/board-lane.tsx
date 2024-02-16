import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useDrop } from "react-dnd";

import { queries } from "@/api/queries";
import { moveTask } from "@/api/services/tasks";
import { ItemTypes } from "@/constants/item-types";
import { cn } from "@/lib/utils";
import React, { Suspense } from "react";
import { TaskCardItem } from "./task-card";

const EmptyLane = lazy(() => import("@/components/dashboard/empty-lane"));

type BoardLaneProps = {
  name: string;
  isFinal?: boolean;
  stageId: string;
  boardSlug: string;
  children: React.ReactNode;
};

export function BoardLane({
  name,
  children,
  boardSlug,
  stageId,
  isFinal = false,
}: BoardLaneProps) {
  const [parent] = useAutoAnimate();

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: moveTask,
    onMutate(data) {
      const options = queries.boards.slug(boardSlug);
      queryClient.cancelQueries(options);
      queryClient.setQueryData(options.queryKey, (pre) => {
        if (!pre) return pre;

        let stageId = "";
        let task: (typeof pre.stages)[number]["tasks"][number];

        for (const stage of pre.stages) {
          for (const stageTask of stage.tasks) {
            if (stageTask.slug === data.taskSlug) {
              task = stageTask;
              stageId = stage.id;
            }
          }
        }

        return {
          ...pre,
          stages: pre?.stages.map((stage) => {
            if (stage.id !== data.to && stage.id !== stageId) {
              return stage;
            }

            if (stage.id === stageId) {
              return {
                ...stage,
                tasks: stage.tasks.filter(
                  (task) => task.slug !== data.taskSlug,
                ),
              };
            }

            return {
              ...stage,
              tasks: [task, ...stage.tasks],
            };
          }),
        };
      });
    },
    onSettled() {
      queryClient.invalidateQueries(queries.boards.slug(boardSlug));
    },
  });

  const [{ over, dragging }, dropRef] = useDrop(
    () => ({
      accept: ItemTypes.TaskCard,
      collect(monitor) {
        const item = monitor.getItem<TaskCardItem>();
        const itemType = monitor.getItemType();
        return {
          over:
            !!monitor.isOver() &&
            stageId !== item.fromStageId &&
            itemType === ItemTypes.TaskCard,
          dragging:
            item &&
            itemType === ItemTypes.TaskCard &&
            item.fromStageId !== stageId,
        };
      },
      drop(_, monitor) {
        const item = monitor.getItem<TaskCardItem>();
        const itemType = monitor.getItemType();

        if (stageId === item.fromStageId || itemType !== ItemTypes.TaskCard) {
          return;
        }

        mutate({
          taskSlug: item.taskSlug,
          to: stageId,
        });
      },
    }),
    [stageId],
  );

  const setRef = useCallback(
    (element: HTMLUListElement) => {
      parent(element);
      dropRef(element);
    },
    [dropRef, parent],
  );

  const hasChildren = !!React.Children.count(children);

  return (
    <li className="relative flex h-full w-full shrink-0 flex-col overflow-hidden">
      <div className="grow-0 text-sm font-semibold text-gray-600 dark:text-slate-300">
        {name}
      </div>

      {dragging ? (
        <div
          className={cn(
            "absolute inset-0 top-9 rounded-md border-2 border-dashed backdrop-blur-sm",
            dragging &&
              !over &&
              "border-slate-200 bg-slate-200/60 dark:border-sky-800 dark:bg-sky-800/60",
            over &&
              "border-teal-400 bg-teal-400/70 dark:border-green-500 dark:bg-green-500/70",
          )}
        ></div>
      ) : null}

      <ul
        ref={setRef}
        className={cn(
          "flex h-full grow flex-col gap-4 bg-white py-4 opacity-100 transition-opacity dark:bg-transparent",
          (over || dragging) && "opacity-0",
          isFinal && hasChildren && "line-through",
        )}
      >
        {hasChildren ? (
          children
        ) : (
          <Suspense>
            <EmptyLane />
          </Suspense>
        )}
      </ul>
    </li>
  );
}
