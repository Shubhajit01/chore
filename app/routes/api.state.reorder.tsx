import { ActionArgs, json } from "@remix-run/cloudflare";
import { useFetcher } from "@remix-run/react";
import { eq } from "drizzle-orm";
import {
  ChevronLeft,
  ChevronLeftSquare,
  ChevronRight,
  ChevronRightSquare,
} from "lucide-react";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import getDB from "~/db";
import { stages } from "~/db/schema/stages";

export async function action({ request, context }: ActionArgs) {
  const form = await request.formData();
  const result = await z
    .object({
      items: z.array(z.string()),
      orders: z.array(z.string().transform((o) => Number(o))),
    })
    .safeParseAsync({
      items: form.getAll("items"),
      orders: form.getAll("orders"),
    });

  if (!result.success) {
    return json({ ok: false, errors: result.error.formErrors.fieldErrors });
  }

  const db = getDB(context.env.DB);

  const { items, orders } = result.data;

  const [item1, item2] = items;
  const [order1, order2] = orders;

  await Promise.all([
    db
      .update(stages)
      .set({ order: order1 })
      .where(eq(stages.id, item1))
      .returning({ order: stages.order })
      .get(),
    db
      .update(stages)
      .set({ order: order2 })
      .where(eq(stages.id, item2))
      .returning({ order: stages.order })
      .get(),
  ]);

  return json({ ok: true, errros: null });
}

export function StateSwapButton({
  items,
  orders,
  dir,
}: {
  items: string[];
  orders: number[];
  dir: "left" | "right";
}) {
  const Icon = dir === "left" ? ChevronLeftSquare : ChevronRightSquare;

  const fetcher = useFetcher();

  return (
    <fetcher.Form method="POST" action="/api/state/reorder">
      <input type="hidden" name="items" value={items[0]} />
      <input type="hidden" name="items" value={items[1]} />

      <input type="hidden" name="orders" value={orders[0]} />
      <input type="hidden" name="orders" value={orders[1]} />

      <Button
        type="submit"
        size="sm"
        variant="ghost"
        className="m-0 p-0 text-white/30 hover:text-white"
        title={`Move lane to ${dir}`}
        aria-label={`Move lane to ${dir}`}
      >
        <Icon />
      </Button>
    </fetcher.Form>
  );
}
