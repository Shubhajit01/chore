import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { stages } from "./stages";

export const tasks = sqliteTable("tasks", {
  id: text("id").primaryKey().notNull(),
  title: text("title").notNull(),
  description: text("description"),

  stageId: text("stage_id").notNull(),

  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const tasksRelations = relations(tasks, ({ one }) => ({
  state: one(stages, {
    fields: [tasks.stageId],
    references: [stages.id],
  }),
}));
