import { ElementRef } from "react";

import { cn } from "@/lib/utils";
import { updateBoard } from "@/api/services/boards";
import { queries } from "@/api/queries";

type EditableBoardHeadingProps = {
  value: string;
  slug: string;
};

export const EditableBoardHeading = ({
  value,
  slug,
}: EditableBoardHeadingProps) => {
  const [draft, setDraft] = useState(value);
  const [editMode, setEditMode] = useState(false);

  const inputRef = useRef<ElementRef<"input">>(null);

  const className =
    "grow-0 text-3xl font-bold tracking-tight truncate max-w-3xl border-border border py-2 px-4";

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (editMode) {
      inputRef.current?.select();
    }
  }, [editMode]);

  const queryClient = useQueryClient();

  const { mutate, variables } = useMutation({
    mutationFn: updateBoard,
    onMutate(data) {
      queryClient.cancelQueries(queries.boards.all());
      queryClient.setQueryData(queries.boards.all().queryKey, (pre) => {
        if (!pre) return pre;
        return pre.map((board) => (board.slug === data.slug ? data : board));
      });

      queryClient.cancelQueries(queries.boards.slug(data.slug));
      queryClient.setQueryData(
        queries.boards.slug(data.slug).queryKey,
        (pre) => {
          if (!pre) return pre;
          return { ...pre, name: data.name };
        },
      );
    },
    onSettled() {
      queryClient.invalidateQueries(queries.boards.all());
      queryClient.invalidateQueries(queries.boards.slug(slug));
    },
  });

  const exitEditMode = () => {
    setEditMode(false);
    setDraft(value);
  };

  const submit = (raw: string) => {
    const next = raw.trim();
    if (next && next !== value.trim()) {
      mutate({
        slug,
        name: next,
      });
    }
    exitEditMode();
  };

  let label = draft || value;
  if (slug === variables?.slug) {
    label = variables.name;
  }

  return (
    <div className="relative flex w-fit items-end gap-4">
      <h1 className={cn(className, editMode && "opacity-0")}>{label}</h1>
      {!editMode ? (
        <button
          onClick={() => {
            setEditMode(true);
          }}
          className="absolute inset-0 opacity-0"
        >
          Edit board heading
        </button>
      ) : (
        <input
          ref={inputRef}
          value={draft}
          onInputCapture={(e) => setDraft(e.currentTarget.value)}
          className={cn(
            className,
            "absolute inset-0 outline-none",
            "border border-border bg-transparent",
          )}
          onBlur={(e) => {
            submit(e.currentTarget.value);
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              submit(e.currentTarget.value);
            } else if (e.key === "Escape") {
              exitEditMode();
            }
          }}
        />
      )}
    </div>
  );
};
