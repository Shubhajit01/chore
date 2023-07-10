import { zodResolver } from "@hookform/resolvers/zod";
import { ActionArgs, json } from "@remix-run/cloudflare";
import { useFetcher } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { PlusIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import ColorInput from "~/components/ui/color-input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Switch } from "~/components/ui/switch";

import DATA from "~/constants/data";
import getDB from "~/db";
import { boards } from "~/db/schema/boards";
import { states } from "~/db/schema/states";
import useClearForm from "~/hooks/use-clear-form";
import { LoadingIcon } from "~/components/loaders/circle";

const newStageSchema = z.object({
  boardId: z.string().nonempty({ message: "Stage must belong to a board." }),
  name: z.string().nonempty({ message: "Stage name cannot be empty." }),
  theme: z
    .string()
    .nonempty({ message: "Stage needs to have a theme color." })
    .transform((t) => (t.startsWith("#") ? t : `#${t}`)),
  isFinal: z.boolean().default(false),
});

type NewBoardFormValues = z.infer<typeof newStageSchema>;

export async function action({ request, context }: ActionArgs) {
  const form = await request.formData();

  const result = await newStageSchema.safeParseAsync(
    Object.fromEntries(form.entries())
  );

  if (!result.success) {
    return json(
      { ok: false, errors: result.error.formErrors.fieldErrors },
      400
    );
  }

  const db = getDB(context.env.DB);

  await Promise.all([
    db
      .insert(states)
      .values({
        id: crypto.randomUUID(),
        name: result.data.name,
        theme: result.data.theme,
        isFinal: result.data.isFinal,
        boardId: result.data.boardId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .get(),

    db
      .update(boards)
      .set({ updatedAt: new Date() })
      .where(eq(boards.id, result.data.boardId))
      .get(),
  ]);

  return json({ ok: true, errors: null });
}

type NewStageProps = { boardId: string };
export function NewStage({ boardId }: NewStageProps) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const fetcher = useFetcher<typeof action>();

  const form = useForm<NewBoardFormValues>({
    resolver: zodResolver(newStageSchema),
    defaultValues: { name: "", theme: "#7efbbb", isFinal: false, boardId },
  });

  useClearForm({ open, form });

  useEffect(() => {
    if (fetcher.data?.ok) {
      setOpen(false);
    }
  }, [fetcher.data]);

  const busy = fetcher.state !== "idle";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary">
          <PlusIcon className="w-5 h-5 mr-1" /> Add Stage
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create a new stage</SheetTitle>
          <SheetDescription>{DATA.STATE_DESCRIPTION_SMALL}</SheetDescription>
        </SheetHeader>

        <FormProvider {...form}>
          <fetcher.Form
            className="mt-2 space-y-4"
            method="POST"
            action="/api/stage/new"
            ref={formRef}
            onSubmit={form.handleSubmit(() => fetcher.submit(formRef.current))}
          >
            <input type="hidden" {...form.register("boardId")} readOnly />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stage name</FormLabel>
                  <FormControl>
                    <Input placeholder='say "todo"' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full">
                    Choose a color to represent the stage
                  </FormLabel>
                  <FormControl>
                    <ColorInput
                      name={field.name}
                      color={field.value}
                      onColorChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isFinal"
              render={({ field }) => (
                <FormItem className="grid grid-cols-[44px_1fr] gap-2">
                  <FormControl>
                    <Switch
                      name={field.name}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="w-full">Mark as final stage</FormLabel>
                  <FormMessage className="col-span-2" />
                </FormItem>
              )}
            />

            <div className="w-full flex justify-end items-center mt-3 ml-auto gap-4">
              {busy ? <LoadingIcon className="w-6 h-6" /> : null}

              <Button type="submit" size="sm" disabled={busy}>
                Create
              </Button>
            </div>
          </fetcher.Form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
}
