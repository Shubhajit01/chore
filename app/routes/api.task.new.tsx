import { zodResolver } from "@hookform/resolvers/zod";
import { ActionArgs, json } from "@remix-run/cloudflare";
import { useFetcher } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Textarea } from "~/components/ui/textarea";

import DATA from "~/constants/data";
import getDB from "~/db";
import { tasks } from "~/db/schema/tasks";
import useClearForm from "~/hooks/use-clear-form";

const newTaskSchema = z.object({
  title: z
    .string({ required_error: "Task title cannot be empty." })
    .nonempty({ message: "Task title cannot be empty." }),
  stateId: z
    .string({ required_error: "Task must belong to a stage." })
    .nonempty({ message: "Stage id must be a proper id." }),
  description: z.string().optional(),
});

type NewTaskFormValues = z.infer<typeof newTaskSchema>;

export async function action({ request, context }: ActionArgs) {
  const form = await request.formData();

  const result = await newTaskSchema.safeParseAsync(
    Object.fromEntries(form.entries())
  );

  if (!result.success) {
    return json(
      { ok: false, errors: result.error.formErrors.fieldErrors },
      400
    );
  }

  const { id } = await getDB(context.env.DB)
    .insert(tasks)
    .values({
      ...result.data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning({ id: tasks.id })
    .get();

  return json({ ok: true, errors: null });
}

type NewTaskProps = {
  stateItems: { value: string; label: string }[];
};

export function NewTask({ stateItems }: NewTaskProps) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const fetcher = useFetcher<typeof action>();

  const form = useForm<NewTaskFormValues>({
    resolver: zodResolver(newTaskSchema),
    defaultValues: { title: "", stateId: stateItems[0]?.value },
  });

  useClearForm<NewTaskFormValues>({ open, form });

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) {
      setOpen(false);
    }
  }, [fetcher.state]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>Add Task</Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create a new board</SheetTitle>
          <SheetDescription>{DATA.BOARD_DESCRIPTION}</SheetDescription>
        </SheetHeader>

        <FormProvider {...form}>
          <fetcher.Form
            className="mt-2 space-y-4"
            method="POST"
            action="/api/task/new"
            ref={formRef}
            onSubmit={form.handleSubmit(() => fetcher.submit(formRef.current))}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='say "create that big plan"'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stage</FormLabel>
                  <Select
                    name={field.name}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the initial stage of the task" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {stateItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name={field.name}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    value={field.value}
                    placeholder="Write a snapping description of the task here..."
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="w-full flex justify-end mt-3 ml-auto">
              <Button type="submit" size="sm">
                Submit
              </Button>
            </div>
          </fetcher.Form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
}
