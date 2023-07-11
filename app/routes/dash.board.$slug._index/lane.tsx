import { useDroppable } from "@dnd-kit/core";
import { cn } from "~/lib/utils";

export default function Lane({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) {
  const { setNodeRef, isOver, active } = useDroppable({ id });

  const isDragging = !!active?.id;
  const isDraggingFromCurrentLane = active?.data.current?.laneId === id;
  const isOverCurrent = !isDraggingFromCurrentLane && isOver;

  return (
    <ul
      className={cn(
        "single-lane group space-y-4 min-h-[12.5rem]",
        isDragging &&
          !isDraggingFromCurrentLane &&
          "backdrop-blur border-2 border-dashed border-sky-800 bg-sky-800/60",
        isOverCurrent && "border-solid border-green-500 bg-green-500/60"
      )}
      ref={setNodeRef}
    >
      {children}
    </ul>
  );
}
