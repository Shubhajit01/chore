import { Session } from "@supabase/supabase-js";
import {
  ScrollRestoration,
  createRootRouteWithContext,
} from "@tanstack/react-router";

import type { QueryClient } from "@tanstack/react-query";

import { client } from "@/api/client";
import { Toaster } from "@/components/ui/sonner";

const NotFound = lazy(() => import("@/components/shared/not-found"));

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  session: Session | null;
}>()({
  async beforeLoad() {
    const { data } = await client.auth.getSession();
    return data;
  },
  component: function RootComponent() {
    return (
      <>
        <Outlet />
        <ScrollRestoration />
        <Toaster />
      </>
    );
  },
  wrapInSuspense: true,
  notFoundComponent: NotFound,
});
