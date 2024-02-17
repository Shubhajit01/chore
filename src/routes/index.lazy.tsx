import { Button } from "@/components/ui/button";

export const Route = createLazyFileRoute("/")({
  component: function Homepage() {
    return (
      <>
        <Helmet>
          <title>Home</title>
        </Helmet>

        <main className="flex min-h-screen w-screen">
          <section className="flex flex-1">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:px-12 lg:px-24 lg:py-24">
              <div className="mx-auto flex h-full max-w-7xl flex-wrap items-center">
                <div className="w-full rounded-xl lg:w-1/2 lg:max-w-lg">
                  <div>
                    <div className="relative w-full max-w-lg">
                      <div className="animate-blob absolute -left-4 top-0 h-72 w-72 rounded-full bg-violet-300 opacity-70 mix-blend-multiply blur-xl filter"></div>

                      <div className="animate-blob animation-delay-4000 absolute -bottom-24 right-20 h-72 w-72 rounded-full bg-fuchsia-300 opacity-70 mix-blend-multiply blur-xl filter"></div>
                      <div className="relative">
                        <img
                          className="mx-auto rounded-lg object-cover object-center shadow-2xl"
                          alt="hero"
                          src="/assets/images/placeholders/squareCard.png"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-16 mt-12 flex flex-col items-start text-left md:mb-0 lg:w-1/2 lg:flex-grow lg:pl-6 xl:mt-0 xl:pl-24">
                  <span className="mb-8 text-xs font-bold uppercase tracking-widest text-primary">
                    Simplified task management
                  </span>
                  <h1 className="mb-8 text-4xl font-bold leading-none tracking-tighter md:text-7xl lg:text-5xl">
                    Streamlining Your Workflow, One Task at a Time.
                  </h1>
                  <p className="mb-8 text-left text-base font-medium leading-relaxed text-muted-foreground">
                    Meet Chore – where simplicity meets efficiency. Our
                    lightweight task manager has exactly what you need, letting
                    you effortlessly organize and move tasks through stages.
                    Streamline your workflow without the unnecessary clutter
                  </p>
                  <div className="mt-0 max-w-7xl space-x-4 sm:flex lg:mt-6">
                    <Button asChild variant="secondary" size="lg">
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button asChild variant="default" size="lg">
                      <Link to="/join">Register</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </>
    );
  },
});
