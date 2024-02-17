import ThemeSwitcher from "@/components/shared/theme-switcher";
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
  component: function AuthLayout() {
    return (
      <>
        <Outlet />
        <aside className="fixed right-10 top-10">
          <ThemeSwitcher />
        </aside>
      </>
    );
  },
});
