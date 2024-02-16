import { client } from "@/api/client";

export async function fetchBoards() {
  const { data } = await client
    .from("boards")
    .select("slug, name")
    .order("created_at", { ascending: false });
  return data || [];
}

export async function fetchBoardBySlug(slug: string) {
  const { data } = await client
    .from("boards")
    .select(
      "*, stages (board_id, name, id, is_final, tasks (id, slug, title, description, due_date, created_at))",
    )
    .eq("slug", slug)
    .order("updated_at", {
      referencedTable: "stages.tasks",
      ascending: false,
      nullsFirst: false,
    })
    .order("created_at", { referencedTable: "stages.tasks", ascending: false })
    .limit(1)
    .single();

  return data || null;
}

export async function createNewBoard({
  name,
  slug,
}: {
  name: string;
  slug: string;
}) {
  const { data: maybeSession } = await client.auth.getSession();
  if (!maybeSession || !maybeSession.session?.user.id)
    throw new Error("No session");

  const { session } = maybeSession;

  const { data, error } = await client
    .from("boards")
    .insert({
      name,
      slug,
      user_id: session?.user.id,
    })
    .select("slug")
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function updateBoard({
  name,
  slug,
}: {
  name: string;
  slug: string;
}) {
  const { data, error } = await client
    .from("boards")
    .update({ name })
    .eq("slug", slug)
    .select("name");

  if (error) throw new Error(error.message);

  return data;
}
