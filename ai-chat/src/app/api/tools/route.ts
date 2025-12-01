import { streamText, UIMessage, convertToModelMessages, tool, stepCountIs } from "ai";
import { z } from "zod";

const tools = {
	getWeather: tool({
		name: "getWeather",
		description: "Get the weather for a specific location",
		inputSchema: z.object({
			city: z.string().describe("The location to get the weather for"),
		}),
		execute: async ({ city }) => {
			const response = await fetch(
				`http://api.weatherapi.com/v1/current.json?key=3581567445cc4bb794e174714252211&q=${city}`
			);
			const data = await response.json();
			return data;
		},
	}),
};
export async function POST(req: Request) {
	try {
		const { messages }: { messages: UIMessage[] } = await req.json();
		const result = streamText({
			model: "openai/gpt-4.1-nano",
			messages: convertToModelMessages(messages),
			tools,
			stopWhen: stepCountIs(2),
		});
		return result.toUIMessageStreamResponse();
	} catch (err) {
		console.error("Error streaming chat completion", err);
		return new Response("failed to stream chat completion", { status: 500 });
	}
}
