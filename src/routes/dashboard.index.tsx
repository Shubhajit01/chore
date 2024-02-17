import { redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
  beforeLoad() {
    throw redirect({
      to: "/dashboard/boards",
    });
  },
});
