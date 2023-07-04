import { drizzle } from "drizzle-orm/d1";

import * as boards from "./schema/boards";
import * as states from "./schema/states";
import * as tasks from "./schema/tasks";
import * as users from "./schema/users";

const getDB = (client: D1Database) => {
  return drizzle(client, {
    schema: {
      ...users,
      ...boards,
      ...states,
      ...tasks,
    },
  });
};

export default getDB;
