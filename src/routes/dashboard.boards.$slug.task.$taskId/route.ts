import { queries } from "@/api/queries";
import { SelectData } from "@/components/dashboard/task-form";

export const Route = createFileRoute("/dashboard/boards/$slug/task/$taskId")({
  async loader({ context, params }) {
    const [, board] = await Promise.all([
      context.queryClient.ensureQueryData(queries.tasks.one(params.taskId)),
      context.queryClient.ensureQueryData(queries.boards.slug(params.slug)),
    ]);

    const stages = board?.stages.map<SelectData[number]>(({ id, name }) => ({
      label: name,
      value: id,
    }));

    return {
      stages: stages ?? [],
    };
  },
});
