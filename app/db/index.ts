import { drizzle } from "drizzle-orm/d1";

import * as boards from "./schema/boards";
import * as stages from "./schema/stages";
import * as tasks from "./schema/tasks";
import * as users from "./schema/users";

const getDB = (client: D1Database) => {
  return drizzle(client, {
    schema: {
      ...users,
      ...boards,
      ...stages,
      ...tasks,
    },
  });
};

export default getDB;
