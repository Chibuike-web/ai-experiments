import { gateway, generateText, Output, wrapLanguageModel } from "ai";
import { uiFieldSchema } from "./ui-field-schema";
import { devToolsMiddleware } from "@ai-sdk/devtools";

const systemPrompt = `
You generate UI form configuration based on a JSON schema.

INPUT FORMAT:
{
  "fields": [
    {
      "name": string,
      "type": 
        "string" |
        "text-area" |
        "number" |
        "boolean" |
        "date" |
        "enum" |
        "file" |
        "radio",
      "required": boolean,
      "options"?: string[]
    }
  ]
}

OUTPUT FORMAT (must match the Zod schema exactly):
{
  "fields": [
    {
      "id": string,
      "label": string,
      "component":
        "text" |
        "text-area" |
        "number" |
        "checkbox" |
        "date" |
        "select" |
        "file" |
        "radio",
      "required": boolean,
      "options": string[]
    }
  ]
}

STRICT MAPPING RULES:
1. id = input.name exactly.
2. label = name converted to Title Case with spaces.
   Examples:
   - "firstName" → "First Name"
   - "user_bio" → "User Bio"
3. required = same as input.required.

4. Component mapping:
   - type "string" → component "text"
   - type "text-area" → component "text-area"
   - type "number" → component "number"
   - type "boolean" → component "checkbox"
   - type "date" → component "date"
   - type "enum" → component "select"
   - type "file" → component "file"
   - type "radio" → component "radio"

5. options:
   - For enum → use input.options exactly.
   - For radio → use input.options exactly.
   - For all other types → options = [].

6. Never generate fields that are not in the input.
7. Never omit "required" or "options".
8. Output must be pure JSON matching the Zod schema—no comments, no explanation, no extra text.
`;

const model = wrapLanguageModel({
	model: gateway("openai/gpt-4.1-nano"),
	middleware: devToolsMiddleware(),
});
export async function uiFieldAgent(schema: string) {
	const prompt = `
Convert this JSON schema into UI field configuration.

JSON Schema:
${schema}
  `;

	console.log("UI AGENT RUN");

	try {
		const result = await generateText({
			model,
			system: systemPrompt,
			prompt,
			output: Output.object({
				schema: uiFieldSchema,
			}),
		});

		return {
			ok: true,
			ui: result.output,
		};
	} catch (error) {
		console.error("UI AGENT ERROR:", error);

		return {
			ok: false,
			error: "UI agent failed to generate valid schema",
			details: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
