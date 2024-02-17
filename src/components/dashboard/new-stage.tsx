import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { createStage } from "@/api/services/stages";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import PlusIcon from "~icons/heroicons/plus-20-solid";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { queries } from "@/api/queries";
import { ToastIcon, toast } from "../ui/sonner";
import CheckCircleIcon from "~icons/heroicons/check-circle-20-solid";

type BoardMeta = {
  boardId: string;
  boardSlug: string;
  empty?: boolean;
};

export function NewStage(props: BoardMeta) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size={props.empty ? "lg" : "sm"}
          className="flex items-center gap-1"
        >
          <PlusIcon className="size-5" />
          Add Stage
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Stage</DialogTitle>
          <DialogDescription>
            Track task progress with states representing stages in the workflow.
            Organize tasks for effective workload management and prioritization.
          </DialogDescription>
        </DialogHeader>

        <NewStageForm {...props} close={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

const newStageSchema = z.object({
  name: z.string().min(5).max(30),
  is_final: z.boolean(),
});

type NewStageSchema = z.infer<typeof newStageSchema>;

function NewStageForm({
  close,
  boardId,
  boardSlug,
}: {
  close: () => void;
} & BoardMeta) {
  const form = useForm<NewStageSchema>({
    resolver: zodResolver(newStageSchema),
    defaultValues: {
      name: "",
      is_final: false,
    },
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createStage,
    onMutate(data) {
      queryClient.cancelQueries(queries.boards.slug(boardSlug));

      const stage = { ...data, tasks: [] };
      queryClient.setQueryData(
        queries.boards.slug(boardSlug).queryKey,
        // @ts-expect-error Partial object provided
        (pre) => ({
          ...pre,
          stages: pre?.stages.length ? [...pre.stages, stage] : [stage],
        }),
      );

      close();
    },
    onSettled() {
      queryClient.invalidateQueries(queries.boards.slug(boardSlug));
    },
    onSuccess(_, { name }) {
      toast("Stage created", {
        icon: <ToastIcon icon={CheckCircleIcon} type="success" />,
        description: `The stage "${name}" has been successfully created.`,
      });
    },
  });

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit((val) => {
          console.log(val);
          mutate({ ...val, board_id: boardId });
        })}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provide a name</FormLabel>
              <FormControl>
                <Input {...field} placeholder='say "todo"' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_final"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2.5">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Set as final stage</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap [&>button]:w-full sm:[&>button]:w-auto">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>

          <Button type="submit" disabled={isPending}>
            Create
          </Button>
        </div>
      </form>
    </Form>
  );
}
