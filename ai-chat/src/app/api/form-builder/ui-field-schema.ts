import { z } from "zod";

export const uiFieldSchema = z.object({
	fields: z.array(
		z.object({
			id: z.string(),
			label: z.string(),
			component: z.enum([
				"text",
				"number",
				"checkbox",
				"select",
				"date",
				"text-area",
				"file",
				"radio",
			]),
			required: z.boolean(),
			options: z.array(z.string()),
		})
	),
});
