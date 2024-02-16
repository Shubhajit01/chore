import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export function BoardLaneZone({
  children,
  columnLength = 1,
}: {
  children: React.ReactNode;
  columnLength: number;
}) {
  const [parent] = useAutoAnimate();

  return (
    <DndProvider backend={HTML5Backend}>
      <ul
        // @ts-expect-error Custom properties
        style={{ "--cols": columnLength }}
        ref={parent}
        className="grid h-full grid-cols-[repeat(var(--cols),_minmax(320px,_1fr))] items-stretch gap-x-12"
      >
        {children}
      </ul>
    </DndProvider>
  );
}
