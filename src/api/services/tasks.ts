import { client } from "../client";
import { TablesUpdate } from "../client/database.types";

export async function createTask(params: {
  description: string;
  slug: string;
  stage_id: string;
  title: string;
  due_date: string | null;
}) {
  const { data, error } = await client
    .from("tasks")
    .insert({
      description: params.description,
      slug: params.slug,
      stage_id: params.stage_id,
      title: params.title,
      due_date: params.due_date,
    })
    .select("id");

  if (error) throw new Error(error.message);
  return data[0];
}

export async function moveTask({
  taskSlug,
  to,
}: {
  taskSlug: string;
  to: string;
}) {
  const { data, error } = await client
    .from("tasks")
    .update({ stage_id: to })
    .eq("slug", taskSlug)
    .select("stage_id");

  if (error) throw new Error(error.message);

  return data;
}

export async function getTask(id: string) {
  const { data, error } = await client
    .from("tasks")
    .select("*")
    .eq("id", id)
    .limit(1)
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function updateTask({
  id,
  ...task
}: TablesUpdate<"tasks"> & { id: string }) {
  const { data, error } = await client
    .from("tasks")
    .update(task)
    .eq("id", id)
    .select("id");

  if (error) throw new Error(error.message);

  return data;
}
