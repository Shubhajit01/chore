import { redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  beforeLoad({ context }) {
    if (context.session) {
      throw redirect({
        to: "/dashboard/boards",
        replace: true,
      });
    }
  },
});
