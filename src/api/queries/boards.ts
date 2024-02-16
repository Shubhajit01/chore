import { queryOptions } from "@tanstack/react-query";
import { fetchBoardBySlug, fetchBoards } from "../services/boards";

export const boardQueries = {
  all: () =>
    queryOptions({
      queryKey: ["boards"],
      queryFn: fetchBoards,
    }),

  slug: (slug: string) =>
    queryOptions({
      queryKey: [...boardQueries.all().queryKey, { slug }],
      queryFn: () => fetchBoardBySlug(slug),
    }),
};
