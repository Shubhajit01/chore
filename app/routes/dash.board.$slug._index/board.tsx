import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useNavigation, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import { TypographySmall } from "~/components/ui/typography";
import Lane from "./lane";
import LaneItem from "./lane-item";

import type { SerializeFrom } from "@remix-run/cloudflare";
import { StateSwapButton } from "../api.state.reorder";
import type { loader } from "./route";
import { motion } from "framer-motion";

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
      {lanes.map((state, index) => (
        <motion.li
          layoutId={state.id}
          key={state.id}
          className="w-full max-w-xs shrink-0 py-2"
          style={{ "--theme": state.theme, order: state.order } as any}
        >
          <div className="flex items-center gap-2">
            <div className="rounded-full w-2 h-2 bg-[--theme]" />
            <TypographySmall className="text-white">
              {state.name}
            </TypographySmall>

            <div className="flex items-center ml-auto">
              {index !== 0 ? (
                <StateSwapButton
                  dir="left"
                  items={[state.id, lanes[index - 1]?.id]}
                  orders={[lanes[index - 1]?.order ?? 0, state.order ?? 0]}
                />
              ) : null}

              {index !== lanes.length - 1 ? (
                <StateSwapButton
                  dir="right"
                  items={[state.id, lanes[index + 1]?.id]}
                  orders={[lanes[index + 1]?.order ?? 0, state.order ?? 0]}
                />
              ) : null}
            </div>
          </div>

          <div className="relative mt-2">
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
        </motion.li>
      ))}
    </DndContext>
  );
}
