import EmptyRectangle from "~icons/streamline/interface-edit-select-area-rectangle-dash-select-area-object-work";

export default function EmptyLane() {
  return (
    <div className="flex aspect-video flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border bg-muted text-center text-sm font-medium text-muted-foreground !no-underline dark:bg-slate-800/20">
      <EmptyRectangle className="size-6 opacity-70" />
      <span>No tasks pending in this stage</span>
    </div>
  );
}
