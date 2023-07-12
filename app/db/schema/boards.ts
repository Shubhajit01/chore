import { InferModel, relations } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { stages } from "./stages";

export const boards = sqliteTable(
  "boards",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),

    userId: text("user_id").notNull(),

    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (boards) => ({
    boardsSlugIdx: uniqueIndex("boards_slug_idx").on(boards.slug),
  })
);

export const boardsRelations = relations(boards, ({ one, many }) => ({
  user: one(users, {
    fields: [boards.userId],
    references: [users.id],
  }),
  stages: many(stages),
}));

export type InsertBoard = InferModel<typeof boards, "insert">;
