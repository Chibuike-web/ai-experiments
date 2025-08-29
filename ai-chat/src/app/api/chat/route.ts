import { streamText, UIMessage, convertToModelMessages } from "ai";

export async function POST(req: Request) {
	try {
		const { messages }: { messages: UIMessage[] } = await req.json();
		const result = streamText({
			model: "openai/gpt-4.1-nano",
			messages: convertToModelMessages(messages),
		});
		result.usage.then((usage) => {
			console.log({
				messageCount: messages.length,
				inputTokens: usage.inputTokens,
				outputTokens: usage.outputTokens,
				totalTokens: usage.totalTokens,
			});
		});

		return result.toUIMessageStreamResponse();
	} catch (err) {
		console.error("Error streaming chat completion", err);
		return new Response("failed to stream chat completion", { status: 500 });
	}
}
