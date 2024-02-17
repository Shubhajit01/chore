import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { APP_CONFIG } from "@/constants/config";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/dashboard")({
  component: memo(function DashboardLayout() {
    return (
      <>
        <Helmet titleTemplate={`%s | Dashboard | ${APP_CONFIG.title}`} />
        <div className="flex h-[100dvh] w-screen flex-col-reverse items-stretch justify-start gap-4 bg-gradient-to-r from-sky-50/60 via-transparent to-sky-50/60 dark:from-fuchsia-600/10 dark:to-transparent sm:flex-row sm:gap-0">
          <DashboardNav />
          <Outlet />
        </div>
      </>
    );
  }),
});
