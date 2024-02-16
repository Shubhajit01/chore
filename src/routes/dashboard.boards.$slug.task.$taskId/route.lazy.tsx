import { queries } from "@/api/queries";
import { updateTask } from "@/api/services/tasks";
import { TaskForm } from "@/components/dashboard/task-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createLazyFileRoute(
  "/dashboard/boards/$slug/task/$taskId",
)({
  component: memo(function EditTaskComponent() {
    const { taskId, slug } = Route.useParams();

    const { stages } = Route.useLoaderData();

    const { data: task } = useSuspenseQuery(queries.tasks.one(taskId));

    const close = () => {
      history.back();
    };

    const queryClient = useQueryClient();

    const { mutateAsync } = useMutation({
      mutationFn: updateTask,
      onMutate(data) {
        queryClient.cancelQueries(queries.boards.slug(slug));
        queryClient.cancelQueries(queries.tasks.one(taskId));

        queryClient.setQueryData(queries.boards.slug(slug).queryKey, (pre) => {
          if (!pre) return pre;

          let existing: (typeof pre)["stages"][number]["tasks"][number];

          for (const stage of pre.stages) {
            if (existing!) break;

            for (const task of stage.tasks) {
              if (task.id === data.id) {
                existing = { ...task, ...data, created_at: task.created_at };
                break;
              }
            }
          }

          return {
            ...pre,
            stages: pre.stages.map((stage) => {
              return {
                ...stage,
                tasks:
                  stage.id === data.stage_id && task.stage_id !== data.stage_id
                    ? [existing, ...stage.tasks]
                    : stage.tasks
                        .map((task) => {
                          if (task.id !== data.id) {
                            return task;
                          }

                          if (data.stage_id === stage.id) {
                            return { ...task, ...data };
                          }

                          return null as unknown as typeof task;
                        })
                        .filter(Boolean),
              };
            }),
          };
        });

        queryClient.setQueryData(queries.tasks.one(taskId).queryKey, (pre) => {
          if (!pre) return pre;
          return {
            ...pre,
            ...data,
          };
        });

        close();
      },
      onSettled() {
        queryClient.invalidateQueries(queries.boards.all());
        queryClient.invalidateQueries(queries.tasks.one(taskId));
      },
    });

    return (
      <Dialog
        defaultOpen
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            close();
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit task</DialogTitle>
          </DialogHeader>

          <div className="mt-6">
            <TaskForm
              stages={stages}
              defaultValues={task}
              onSubmit={(values) => mutateAsync({ ...values, id: taskId })}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }),
});
