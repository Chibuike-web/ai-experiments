import { devToolsMiddleware } from "@ai-sdk/devtools";
import { streamText, UIMessage, convertToModelMessages, wrapLanguageModel, gateway } from "ai";

const model = wrapLanguageModel({
	model: gateway("openai/gpt-4.1-nano"),
	middleware: devToolsMiddleware(),
});

export async function POST(req: Request) {
	try {
		const { messages }: { messages: UIMessage[] } = await req.json();
		const result = streamText({
			model,
			messages: [
				{
					role: "system",
					content:
						"You are a friendly teacher who explain concepts using simple analogies. Always relate concepts to everyday experiences",
				},
				...convertToModelMessages(messages),
			],
		});

		return result.toUIMessageStreamResponse();
	} catch (err) {
		console.error("Error streaming chat completion", err);
		return new Response("failed to stream chat completion", { status: 500 });
	}
}
