import { devToolsMiddleware } from "@ai-sdk/devtools";
import { gateway, generateText, wrapLanguageModel } from "ai";

const systemPrompt = `
You generate form titles.

Your task is to produce a short, clear, human-friendly title for a form based on a user’s description.

RULES:
- Output ONLY the title text.
- Do NOT include quotes.
- Do NOT include punctuation at the end.
- Do NOT include explanations.
- Title must be 2–6 words.
- Use Title Case.
- Be descriptive, not generic.

GUIDELINES:
- If the form is about onboarding → include "Onboarding"
- If it is about applications → include "Application"
- If it is about registration → include "Registration"
- If it is about feedback → include "Feedback"
- If it is about booking → include "Booking" or "Reservation"
- Prefer nouns over verbs.
`;

const model = wrapLanguageModel({
	model: gateway("openai/gpt-4.1-nano"),
	middleware: devToolsMiddleware(),
});

export async function formTitleAgent(userPrompt: string) {
	const prompt = `
Generate a concise title for the following form description:

${userPrompt}
	`;

	try {
		const { text } = await generateText({
			model,
			system: systemPrompt,
			prompt,
		});

		return { ok: true, title: text.trim() };
	} catch (error) {
		console.error("TITLE AGENT ERROR:", error);
		return { ok: false, error: "Title generation failed" };
	}
}
