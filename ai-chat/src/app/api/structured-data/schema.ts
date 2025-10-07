import { z } from "zod";

export const receipeSchema = z.object({
	receipe: z.object({
		name: z.string(),
		ingredients: z.array(
			z.object({
				name: z.string(),
				amount: z.string(),
			})
		),
		steps: z.array(z.string()),
	}),
});
