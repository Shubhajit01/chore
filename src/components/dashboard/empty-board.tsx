// @ts-expect-error Image directive
import emptyFolderImage from "@/assets/empty-folder.png?format=webp&quality=100";

export const EmptyBoard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="mt-48 flex flex-col items-center overflow-hidden">
      <div className="rounded-full border-2 border-dashed border-border bg-slate-100 p-4 dark:bg-white/5">
        <img className="size-16 sm:size-20" src={emptyFolderImage} />
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
