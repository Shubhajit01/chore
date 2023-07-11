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
    <div className="relative">
      <ul
        className="single-lane group space-y-4 min-h-[12.5rem]"
        ref={setNodeRef}
      >
        {children}
      </ul>

      {isDragging && !isDraggingFromCurrentLane ? (
        <div
          className={cn(
            "absolute inset-0 backdrop-blur-sm z-10 border-dashed  border-2 border-sky-800 bg-sky-800/60",
            isOverCurrent && "border-solid border-green-500 bg-green-500/60"
          )}
        ></div>
      ) : null}
    </div>
  );
}
