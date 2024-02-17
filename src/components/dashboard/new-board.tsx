import { Button, ButtonProps } from "@/components/ui/button";
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

import { queries } from "@/api/queries";
import { createNewBoard } from "@/api/services/boards";
import { slugit } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import CheckCircleIcon from "~icons/heroicons/check-circle-20-solid";
import PlusIcon from "~icons/heroicons/plus-20-solid";
import { Input } from "../ui/input";
import { ToastIcon } from "../ui/sonner";

export function NewBoard({
  label = "Create another board",
  variant = "outline",
  size = "sm",
}: {
  label?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className="!mt-4 flex items-center gap-1"
        >
          <PlusIcon className="size-5" />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Board</DialogTitle>
          <DialogDescription>
            A board will let you to group your tasks together and keep them
            organized in our app.
          </DialogDescription>
        </DialogHeader>

        <NewBoardForm close={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

const newBoardSchema = z.object({
  name: z.string().min(5).max(30),
});

type NewBoardSchema = z.infer<typeof newBoardSchema>;

function NewBoardForm({ close }: { close: () => void }) {
  const form = useForm<NewBoardSchema>({
    resolver: zodResolver(newBoardSchema),
    defaultValues: {
      name: "",
    },
  });

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createNewBoard,
    onMutate({ name, slug }) {
      queryClient.cancelQueries(queries.boards.all());

      queryClient.setQueryData(queries.boards.all().queryKey, (prev = []) => [
        { name, slug },
        ...prev,
      ]);

      queryClient.setQueryData(
        queries.boards.slug(slug).queryKey,
        // @ts-expect-error Partial object provided
        () => ({ name, stages: [] }),
      );

      navigate({ to: "/dashboard/boards/$slug", params: { slug } });
      close();
    },
    onSettled(_, error, { slug }) {
      queryClient.invalidateQueries(queries.boards.all());
      if (error) {
        queryClient.removeQueries(queries.boards.slug(slug));
      } else {
        queryClient.invalidateQueries(queries.boards.slug(slug));
      }
    },
    onSuccess(_, { name }) {
      toast("Board created", {
        icon: <ToastIcon icon={CheckCircleIcon} type="success" />,
        description: `The board "${name}" has been successfully created.`,
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((val) => {
          mutate({
            name: val.name,
            slug: slugit(val.name),
          });
        })}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provide a name</FormLabel>
              <FormControl>
                <Input {...field} placeholder='say "my next big project"' />
              </FormControl>
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
