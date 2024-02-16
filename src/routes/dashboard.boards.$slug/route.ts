import { queries } from "@/api/queries";

export const Route = createFileRoute("/dashboard/boards/$slug")({
  loader({ context, params }) {
    return context.queryClient.ensureQueryData(
      queries.boards.slug(params.slug),
    );
  },
});
