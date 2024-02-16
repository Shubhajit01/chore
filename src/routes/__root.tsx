import {
  ScrollRestoration,
  createRootRouteWithContext,
} from "@tanstack/react-router";

import type { QueryClient } from "@tanstack/react-query";
import { Session } from "@supabase/supabase-js";
import { client } from "@/api/client";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  session: Session;
}>()({
  async beforeLoad() {
    const { data } = await client.auth.getSession();
    return data;
  },
  component: () => {
    return (
      <>
        <Outlet />
        <ScrollRestoration />
      </>
    );
  },
});
