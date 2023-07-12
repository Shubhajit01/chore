import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useNavigation, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import { TypographySmall } from "~/components/ui/typography";
import Lane from "./lane";
import LaneItem from "./lane-item";

import type { SerializeFrom } from "@remix-run/cloudflare";
import type { loader } from "./route";

export type BoardProps = {
  data: Awaited<SerializeFrom<typeof loader>["board"]>;
};

export default function Board({ data }: BoardProps) {
  const submit = useSubmit();

  const { formData } = useNavigation();

  const [lanes, setLanes] = useState<(typeof data)["stages"]>(
    data.stages ?? []
  );

  useEffect(() => {
    setLanes(data.stages);
  }, [data]);

  function onDrop(ev: DragEndEvent) {
    const active = ev.active.data.current;
    const target = ev.over?.id;

    if (!active || !target || target === active.laneId) {
      return;
    }

    const { task, laneId } = active;

    setLanes((cl) =>
      cl.map((state) => ({
        ...state,
        tasks:
          state.id === String(target)
            ? [
                {
                  id: String(task.id),
                  title: String(task.title),
                  description: String(task.description),
                  updatedAt: "a few seconds ago",
                },
                ...state.tasks,
              ]
            : state.id === laneId
            ? state.tasks.filter((t) => t.id !== task.id)
            : state.tasks,
      }))
    );

    submit(
      {
        id: task.id,
        state: target,
        board: data.slug,
      },
      { method: "POST" }
    );
  }

  return (
    <DndContext onDragEnd={onDrop}>
      {lanes.map((state) => (
        <li
          key={state.id}
          className="w-full max-w-xs shrink-0 py-2"
          style={{ "--theme": state.theme } as any}
        >
          <div className="flex items-center gap-2">
            <div className="rounded-full w-2 h-2 bg-[--theme]" />
            <TypographySmall className="text-white">
              {state.name}
            </TypographySmall>
          </div>

          <div className="relative mt-4">
            <Lane id={state.id}>
              {state.tasks.map((task) => (
                <LaneItem
                  key={task.id}
                  laneId={state.id}
                  task={task}
                  final={!!state.isFinal}
                  saving={String(formData?.get("id")) === task.id}
                />
              ))}
            </Lane>
          </div>
        </li>
      ))}
    </DndContext>
  );
}
