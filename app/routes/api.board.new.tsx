import { zodResolver } from "@hookform/resolvers/zod";
import { ActionArgs, json, redirect } from "@remix-run/cloudflare";
import { useFetcher } from "@remix-run/react";
import { PlusIcon } from "lucide-react";
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

import { LoadingIcon } from "~/components/loaders/circle";
import DATA from "~/constants/data";
import getDB from "~/db";
import { boards } from "~/db/schema/boards";
import useClearForm from "~/hooks/use-clear-form";
import { slugit } from "~/lib/utils";

const newBoardSchema = z.object({
  name: z.string().nonempty({ message: "Board name cannot be empty" }),
});

type NewBoardFormValues = z.infer<typeof newBoardSchema>;

export async function action({ request, context }: ActionArgs) {
  const form = await request.formData();

  const result = await newBoardSchema.safeParseAsync(
    Object.fromEntries(form.entries())
  );

  if (!result.success) {
    return json({ ok: false, ...result.error.formErrors.formErrors }, 400);
  }

  const { slug } = await getDB(context.env.DB)
    .insert(boards)
    .values({
      id: crypto.randomUUID(),
      name: result.data.name,
      slug: slugit(result.data.name),
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "65689771-faa1-4528-83a4-c082b13d93b6", // TODO: Connect userId
    })
    .returning({ slug: boards.slug })
    .get();

  return redirect(`/dash/board/${slug}`);
}

export function NewBoard() {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const fetcher = useFetcher();
  const busy = fetcher.state !== "idle";

  const form = useForm<NewBoardFormValues>({
    resolver: zodResolver(newBoardSchema),
    defaultValues: { name: "" },
  });

  useClearForm<NewBoardFormValues>({ open, form });

  useEffect(() => {
    if (fetcher.state === "idle") {
      setOpen(false);
    }
  }, [fetcher.state]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" size="sm">
          <PlusIcon className="w-5 h-5 mr-1" /> Add another board
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create a new board</SheetTitle>
          <SheetDescription>{DATA.BOARD_DESCRIPTION}</SheetDescription>
        </SheetHeader>

        <FormProvider {...form}>
          <fetcher.Form
            className="mt-2"
            method="POST"
            action="/api/board/new"
            ref={formRef}
            onSubmit={form.handleSubmit(() => fetcher.submit(formRef.current))}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Board name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='say "my next big project"'
                      {...field}
                      disabled={busy}
                    />
                  </FormControl>
                  <FormMessage />
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
