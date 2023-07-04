import type { Config } from "drizzle-kit";

export default {
  schema: "./app/db/schema/*",
  out: "./migrations",
} satisfies Config;
