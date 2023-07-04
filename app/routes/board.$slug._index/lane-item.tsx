import { SerializeFrom } from "@remix-run/cloudflare";
import { HistoryIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { loader } from "./route";
import { LoadingIcon } from "~/components/loaders/circle";

type LaneItemProps = {
  task: Awaited<
    SerializeFrom<typeof loader>["board"]
  >["states"][number]["tasks"][number];
  laneId: string;
  final?: boolean;
  saving?: boolean;
  dragging?: boolean;
};

export default function LaneItem({
  laneId,
  task,
  dragging,
  final,
  saving,
}: LaneItemProps) {
  return (
    <li className="group/item relative">
      <div
        role="button"
        tabIndex={0}
        className={cn(
          "peer relative flex flex-col gap-1 border-2 border-white/5 border-l-[--theme] p-4 outline-none",
          final && "line-through",
          saving && "cursor-wait select-none",
          dragging &&
            "relative z-20 translate-x-[--x] translate-y-[--y] transform-gpu cursor-grabbing select-none backdrop-blur-md backdrop-brightness-50",
          !saving &&
            !dragging &&
            "cursor-grab transition-transform duration-200"
        )}
      >
        <div className="w-10/12 truncate font-medium">{task.title}</div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <HistoryIcon className="h-5 w-5" />
          <span>{task.updatedAt}</span>
        </div>

        {saving ? (
          <LoadingIcon className="absolute right-4 top-[1.1rem] h-6 w-6" />
        ) : null}
      </div>
    </li>
  );
}
