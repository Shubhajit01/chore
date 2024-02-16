import { client } from "../client";

export async function createStage(params: {
  board_id: string;
  name: string;
  is_final: boolean;
}) {
  const { data, error } = await client
    .from("stages")
    .insert(params)
    .select("id");
  if (error) throw new Error(error.message);
  return data;
}
