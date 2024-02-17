import { queries } from "@/api/queries";

// @ts-expect-error Image directive import
import kanbanImg from "@/assets/kanban.png?format=webp&w=80&h=80";
import { NewBoard } from "@/components/dashboard/new-board";
import { canCreateBoard } from "@/lib/utils";

export const Route = createLazyFileRoute("/dashboard/boards/")({
  component: memo(function BoardHomePage() {
    const { data } = useSuspenseQuery({
      ...queries.boards.all(),
      select: (d) => ({
        boards: d.slice(0, 3),
        totalLength: d.length,
      }),
    });

    const { boards, totalLength } = data;

    return (
      <div className="relative flex w-full flex-1 flex-col items-center overflow-y-auto px-6 pt-44 text-center">
        <div className="bg-grid absolute inset-0"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-background"></div>

        <div className="relative">
          <div className="absolute inset-0 scale-125 bg-primary opacity-40 blur-xl" />
          <img
            src={kanbanImg}
            width={80}
            height={80}
            className="relative size-[80px]"
          />
        </div>

        <div className="relative mt-5 space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Your boards hub</h1>
          <p className="max-w-xl text-balance text-lg text-muted-foreground">
            Effortlessly manage and navigate through your boards. See an
            overview of your tasks and stay in control of your workflow
          </p>
        </div>

        {canCreateBoard(totalLength) ? (
          <div className="relative">
            <NewBoard label="Create a board" variant="default" size="lg" />
          </div>
        ) : null}

        {boards.length ? (
          <div className="relative mx-auto mt-12 w-full max-w-xs">
            <h2 className="text-sm font-bold uppercase tracking-widest text-teal-500">
              Recent boards
            </h2>
            <ul className="mt-2 w-full divide-y rounded-md border border-input">
              {boards.map((board) => (
                <li key={board.slug}>
                  <Link
                    to="/dashboard/boards/$slug"
                    params={{ slug: board.slug }}
                    className="block py-2 font-medium text-primary underline hover:text-primary/90"
                  >
                    {board.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    );
  }),
});
