import { streamObject } from "ai";
import { receipeSchema } from "./schema";

export async function POST(req: Request) {
	try {
		const { dish } = await req.json();

		const result = streamObject({
			model: "openai/gpt-4.1-nano",
			prompt: `Generate a recipe for ${dish}`,
			schema: receipeSchema,
		});

		return result.toTextStreamResponse();
	} catch (error) {
		console.error("Error generating recipe.", error);
		return new Response("Failed to generate recipe", { status: 500 });
	}
}
