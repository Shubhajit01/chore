import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { states } from "./states";

export const tasks = sqliteTable("tasks", {
  id: text("id").primaryKey().notNull(),
  title: text("title").notNull(),
  description: text("description"),

  stateId: text("state_id").notNull(),

  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const tasksRelations = relations(tasks, ({ one }) => ({
  state: one(states, {
    fields: [tasks.stateId],
    references: [states.id],
  }),
}));
