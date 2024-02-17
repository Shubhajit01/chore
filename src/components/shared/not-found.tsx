// @ts-expect-error Image directives
import notFoundImage from "@/assets/lost.png?format=webp&w=160&h=160";

import { Button } from "../ui/button";
import ThemeSwitcher from "./theme-switcher";

export default function NotFound() {
  return (
    <main className="bg-grid flex min-h-[100dvh] w-screen flex-col items-center justify-center gap-3 px-8">
      <div className="relative">
        <div className="absolute inset-0 scale-150 rounded-full bg-sky-500 opacity-20 blur-2xl dark:opacity-40" />
        <img
          src={notFoundImage}
          width={160}
          height={160}
          className="relative size-40"
          alt="not found illustration"
        />
      </div>

      <div className="mt-12 max-w-xl space-y-6 text-center">
        <h1>
          <p className="text-2xl font-semibold tracking-tight md:text-3xl">
            You seem to be lost.
          </p>
          <p className="mt-3 text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Let's guide you back to organized productivity with Chore!
          </p>
        </h1>

        <Button asChild size="lg">
          <Link to="/">Back to homepage</Link>
        </Button>
      </div>

      <aside className="fixed right-10 top-10">
        <ThemeSwitcher />
      </aside>
    </main>
  );
}