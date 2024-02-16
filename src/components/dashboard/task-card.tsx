import { ItemTypes } from "@/constants/item-types";
import { useDrag } from "react-dnd";

import CalendarIcon from "~icons/radix-icons/countdown-timer";

type TaskCardProps = {
  id: string;
  title: string;
  boardSlug: string;
  stageId: string;
  slug: string;
  description?: string | null;
  due_date?: string | null;
};

export type TaskCardItem = { taskSlug: string; fromStageId: string };

export const TaskCard = memo(function MemoizedTaskCard({
  id,
  title,
  description,
  due_date,
  slug,
  boardSlug,
  stageId,
}: TaskCardProps) {
  const [, dragRef] = useDrag<TaskCardItem>(
    () => ({
      type: ItemTypes.TaskCard,
      item: { taskSlug: slug, fromStageId: stageId },
    }),
    [],
  );

  const dueDate = due_date
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
      }).format(new Date(due_date))
    : "";

  return (
    <li>
      <div
        ref={dragRef}
        className="peer relative flex cursor-grab flex-col rounded-md border bg-slate-50 p-3 px-4 outline-none dark:bg-slate-800/30"
      >
        <Link
          className="text-base font-medium"
          to="/dashboard/boards/$slug/task/$taskId"
          params={{ slug: boardSlug, taskId: id }}
          mask={{ to: "/dashboard/boards/$slug", params: { slug: boardSlug } }}
        >
          {title}
        </Link>

        {description ? (
          <small
            title={description}
            className="line-clamp-1 text-sm font-medium text-muted-foreground"
          >
            {description}
          </small>
        ) : null}

        {dueDate ? (
          <p className="mt-2 flex items-center gap-1 text-xs font-semibold dark:text-slate-500">
            <CalendarIcon />
            <span>Due on {dueDate}</span>
          </p>
        ) : null}
      </div>
    </li>
  );
});
