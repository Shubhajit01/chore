import { D1Database, D1DatabaseAPI } from "@miniflare/d1";
import { createSQLiteDB } from "@miniflare/shared";

export async function makeDB() {
  const sqlLite = await createSQLiteDB(
    ".wrangler/state/v3/d1/e0b088d8-ca5c-44e2-8396-d8e7bba62380/db.sqlite"
  );
  return new D1Database(new D1DatabaseAPI(sqlLite));
}
