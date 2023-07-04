import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { boards } from "./boards";
import { tasks } from "./tasks";

export const states = sqliteTable("states", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  theme: text("theme").notNull(),
  isFinal: integer("is_final", { mode: "boolean" }).default(false),

  boardId: text("board_id").notNull(),

  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const statesRelations = relations(states, ({ many, one }) => ({
  board: one(boards, {
    fields: [states.boardId],
    references: [boards.id],
  }),
  tasks: many(tasks),
}));
