import { InferModel, relations } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { boards } from "./boards";

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey().notNull(),
    email: text("email").notNull(),
    name: text("name").notNull(),
    password: text("password").notNull(),
    dp: text("dp"),

    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (users) => ({
    usersEmailIdx: uniqueIndex("users_email_idx").on(users.email),
  })
);

export const usersRelations = relations(users, ({ many }) => ({
  boards: many(boards),
}));

export type InsertUser = InferModel<typeof users, "insert">;
