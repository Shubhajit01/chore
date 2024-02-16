import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

export type SelectData = {
  label: string;
  value: string;
}[];

const taskSchema = z.object({
  title: z.string().min(5).max(30),
  description: z.string().max(500),
  stage_id: z.string().min(1).uuid(),
  due_date: z.string().nullable(),
});

type TaskSchema = z.infer<typeof taskSchema>;

export function TaskForm({
  onSubmit,
  stages,
  defaultValues,
}: {
  onSubmit: (task: TaskSchema) => void;
  stages: SelectData;
  defaultValues?: TaskSchema;
}) {
  const form = useForm<TaskSchema>({
    resolver: zodResolver(taskSchema),
    defaultValues: defaultValues ?? {
      title: "",
      description: "",
      due_date: null,
      stage_id: stages.length ? stages[0].value : "",
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4 [--gap:0.5rem] md:[--col:9rem_1fr] md:[--gap:0]"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="grid grid-cols-[--col] items-center gap-x-4 space-y-[--gap]">
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder='say "create that big plan"' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stage_id"
          render={({ field }) => (
            <FormItem className="grid grid-cols-[--col] items-center gap-x-4 space-y-[--gap]">
              <FormLabel>Stage</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger disabled={stages.length < 2}>
                    <SelectValue placeholder="Select a stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((stage) => (
                      <SelectItem key={stage.value} value={stage.value}>
                        {stage.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="due_date"
          render={({ field }) => (
            <FormItem className="grid grid-cols-[--col] items-center gap-x-4 space-y-[--gap]">
              <FormLabel>Due date (optional)</FormLabel>
              <FormControl className="block">
                <Input type="date" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="grid grid-cols-[--col] items-start gap-x-4 space-y-[--gap]">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Write a snapping description of the task here..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap [&>button]:w-full sm:[&>button]:w-auto">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>

          <Button
            type="submit"
            disabled={form.formState.isSubmitting || !form.formState.isValid}
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
