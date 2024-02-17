import { Button } from "@/components/ui/button";
import { getRouteApi } from "@tanstack/react-router";

// @ts-expect-error Image directive import
import heroImage from "@/assets/snap.png?format=webp&quality=100";
import ThemeSwitcher from "@/components/shared/theme-switcher";

const api = getRouteApi("/");

export const Route = createLazyFileRoute("/")({
  component: function Homepage() {
    const { session } = api.useRouteContext();

    return (
      <>
        <Helmet>
          <title>Home</title>
        </Helmet>

        <main className="bg-grid max-w-screen min-w-screen flex min-h-screen overflow-x-hidden">
          <section className="flex flex-1">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:px-12 lg:px-24 lg:py-24">
              <div className="mx-auto flex h-full max-w-7xl flex-wrap items-center">
                <div className="w-full rounded-xl lg:w-1/2 lg:max-w-lg">
                  <div>
                    <div className="relative w-full max-w-lg">
                      <div className="animate-blob absolute -left-4 top-0 h-72 w-72 rounded-full bg-violet-300 opacity-70 mix-blend-multiply blur-xl filter dark:mix-blend-overlay"></div>
                      <div className="animate-blob animation-delay-4000 absolute -bottom-24 right-20 h-72 w-72 rounded-full bg-fuchsia-300 opacity-70 mix-blend-multiply blur-xl filter dark:mix-blend-overlay"></div>

                      <div className="relative border-2 border-dashed border-input p-4 dark:border-white/20">
                        <img
                          alt="hero"
                          src={heroImage}
                          width="476"
                          height="405"
                          className="tada mx-auto h-[405[x]] w-[476px] rounded-lg object-cover object-center shadow-2xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-16 mt-12 flex flex-col items-start text-left md:mb-0 lg:w-1/2 lg:flex-grow lg:pl-6 xl:mt-0 xl:pl-24">
                  <span className="mb-8 text-xs font-bold uppercase tracking-widest text-teal-500">
                    Simplified task management
                  </span>
                  <h1 className="mb-8 text-pretty text-4xl font-bold leading-none tracking-tighter sm:text-5xl md:text-6xl lg:text-5xl">
                    Streamlining Your Workflow, One Task at a Time
                  </h1>
                  <p className="mb-8 text-left text-base font-medium leading-relaxed text-muted-foreground">
                    Meet Chore &#45; where simplicity meets efficiency. Our
                    lightweight task manager has exactly what you need, letting
                    you effortlessly organize and move tasks through stages.
                    Streamline your workflow without the unnecessary clutter
                  </p>
                  <div className="mt-0 w-full max-w-7xl space-x-4 sm:flex lg:mt-6">
                    {session?.user.id ? (
                      <Button asChild size="lg" className="w-full grow">
                        <Link preload="intent" to="/dashboard/boards">
                          View my boards
                        </Link>
                      </Button>
                    ) : (
                      <>
                        <Button asChild variant="secondary" size="lg">
                          <Link to="/login">Login</Link>
                        </Button>
                        <Button asChild size="lg">
                          <Link to="/join">Register</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <aside className="fixed right-10 top-10">
          <ThemeSwitcher />
        </aside>
      </>
    );
  },
});
