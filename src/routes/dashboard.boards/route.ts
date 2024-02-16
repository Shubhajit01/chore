import { queries } from "@/api/queries";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/boards")({
  loaderDeps() {
    return {};
  },
  loader({ context }) {
    void context.queryClient.ensureQueryData(queries.boards.all());
  },
});
