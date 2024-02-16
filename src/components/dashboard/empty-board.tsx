export const EmptyBoard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="mt-48 flex flex-col items-center overflow-hidden">
      <div className="rounded-full border-2 border-dashed border-border bg-slate-100 p-6 dark:bg-white/5">
        <img
          className="size-16 sm:size-20 md:size-24"
          src="/images/empty-folder.png"
        />
      </div>

      <div className="mt-6 flex flex-col items-center gap-3">
        <p className="text-center text-lg font-semibold sm:text-xl">
          Let's get started on <span className="text-primary">{title}</span>
        </p>

        {children}
      </div>
    </div>
  );
};
