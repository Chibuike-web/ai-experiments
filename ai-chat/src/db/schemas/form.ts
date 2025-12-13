import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const form = pgTable("form", {
	id: text("id").primaryKey(),
	prompt: text("prompt").notNull(),
	title: text("title").notNull(),
	jsonSchema: jsonb("json_schema").notNull(),
	uiSchema: jsonb("ui_schema").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});
