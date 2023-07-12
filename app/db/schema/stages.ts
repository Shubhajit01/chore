import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { boards } from "./boards";
import { tasks } from "./tasks";

export const stages = sqliteTable("stages", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  theme: text("theme").notNull(),
  isFinal: integer("is_final", { mode: "boolean" }).default(false),

  boardId: text("board_id").notNull(),
  order: integer('order').default(0),

  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const stagesRelations = relations(stages, ({ many, one }) => ({
  board: one(boards, {
    fields: [stages.boardId],
    references: [boards.id],
  }),
  tasks: many(tasks),
}));
