import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { queries } from "@/api/queries";
import { createTask } from "@/api/services/tasks";
import { slugit } from "@/lib/utils";
import { getRouteApi } from "@tanstack/react-router";
import PlusIcon from "~icons/heroicons/plus-20-solid";
import { SelectData, TaskForm } from "./task-form";

const api = getRouteApi("/dashboard/boards/$slug");

export function NewTask({ stages }: { stages: SelectData }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="flex items-center gap-1">
          <PlusIcon className="size-5" />
          New task
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[calc(100vw_-_2rem)] max-w-2xl">
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
          <DialogDescription>
            Tasks help you break down your work, set priorities, and track
            progress. Stay organized and focused by adding tasks to your board.
          </DialogDescription>
        </DialogHeader>

        <NewTaskForm stages={stages} close={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function NewTaskForm({
  stages,
  close,
}: {
  stages: SelectData;
  close: () => void;
}) {
  const { slug: boardSlug } = api.useParams();

  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: createTask,
    onMutate(data) {
      queryClient.cancelQueries(queries.boards.slug(boardSlug));

      queryClient.setQueryData(
        queries.boards.slug(boardSlug).queryKey,
        (pre) => {
          if (!pre) return pre;

          const index = pre.stages.findIndex(
            (stage) => stage.id === data.stage_id,
          );

          const stages = pre.stages.slice();
          stages[index] = {
            ...stages[index],
            tasks: [
              { ...data, created_at: new Date().toISOString(), id: "" },
              ...stages[index].tasks,
            ],
          };

          return { ...pre, stages };
        },
      );

      close();
    },
    onSettled() {
      queryClient.invalidateQueries(queries.boards.slug(boardSlug));
    },
  });

  return (
    <TaskForm
      stages={stages}
      onSubmit={(val) => mutateAsync({ ...val, slug: slugit(val.title) })}
    />
  );
}
