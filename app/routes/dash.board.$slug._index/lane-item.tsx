import { useDraggable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import { HistoryIcon } from "lucide-react";
import { useSpinDelay } from "spin-delay";
import { LoadingIcon } from "~/components/loaders/circle";
import { cn } from "~/lib/utils";

import { BoardProps } from "./board";

type LaneItemProps = {
  task: BoardProps["data"]["stages"][number]["tasks"][number];
  laneId: string;
  final?: boolean;
  saving?: boolean;
};

export default function LaneItem({
  laneId,
  task,
  final,
  saving,
}: LaneItemProps) {
  const { listeners, isDragging, setNodeRef, attributes, transform } =
    useDraggable({
      id: task.id,
      data: {
        task,
        laneId,
      },
    });

  const busy = useSpinDelay(!!saving);

  const dx = transform?.x ?? 0;
  const dy = transform?.y ?? 0;

  return (
    <motion.li
      {...listeners}
      {...attributes}
      layoutId={task.id}
      style={{ x: dx, y: dy }}
      ref={setNodeRef}
      className={cn(
        "peer relative flex flex-col gap-1 border-2 border-white/5 border-l-[--theme] p-4 outline-none",
        final && "line-through",
        busy && "cursor-wait select-none",
        isDragging &&
          "relative z-20 cursor-grabbing select-none backdrop-blur-md backdrop-brightness-50",
        !busy && !isDragging && "cursor-grab"
      )}
    >
      <div className="w-10/12 truncate font-medium">{task.title}</div>
      <div className="flex items-center gap-2 text-sm text-slate-300">
        <HistoryIcon className="h-5 w-5" />
        <span>{task.updatedAt}</span>
      </div>

      {busy ? (
        <LoadingIcon className="absolute right-4 top-[1.1rem] h-6 w-6" />
      ) : null}
    </motion.li>
  );
}
