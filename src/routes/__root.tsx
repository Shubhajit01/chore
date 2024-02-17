import {
  ScrollRestoration,
  createRootRouteWithContext,
} from "@tanstack/react-router";

import { client } from "@/api/client";
import { APP_CONFIG } from "@/constants/config";
import { Session } from "@supabase/supabase-js";
import type { QueryClient } from "@tanstack/react-query";
import { Helmet, HelmetProvider } from "react-helmet-async";

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
});
