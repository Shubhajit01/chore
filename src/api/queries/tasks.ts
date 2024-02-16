import { queryOptions } from "@tanstack/react-query";
import { getTask } from "../services/tasks";

export const taskQueries = {
  one: (id: string) =>
    queryOptions({
      queryKey: ["tasks", { id }],
      queryFn: () => getTask(id),
    }),
};
