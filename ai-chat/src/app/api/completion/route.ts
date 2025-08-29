import { generateText } from "ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const { prompt } = await req.json();
		const { text } = await generateText({
			model: "openai/gpt-4.1-nano",
			prompt,
		});

		return NextResponse.json({ text }, { status: 200 });
	} catch (error) {
		console.error("Error generating text:", error);
		return NextResponse.json({ error: "Failed to generate text" }, { status: 500 });
	}
}
