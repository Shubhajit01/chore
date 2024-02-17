import { Session } from "@supabase/supabase-js";
import {
  ScrollRestoration,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { Helmet, HelmetProvider } from "react-helmet-async";

import type { QueryClient } from "@tanstack/react-query";

import { client } from "@/api/client";
import { APP_CONFIG } from "@/constants/config";

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
      <HelmetProvider>
        <Helmet titleTemplate={`%s | ${APP_CONFIG.title}`} />
        <Outlet />
        <ScrollRestoration />
      </HelmetProvider>
    );
  },
  wrapInSuspense: true,
  notFoundComponent: NotFound,
});
