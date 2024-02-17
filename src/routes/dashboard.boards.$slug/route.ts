import { queries } from "@/api/queries";
import { notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/boards/$slug")({
  wrapInSuspense: true,
  async loader({ context, params }) {
    const data = await context.queryClient.ensureQueryData(
      queries.boards.slug(params.slug),
    );

    if (!data) {
      throw notFound();
    }

    return data;
  },
});
