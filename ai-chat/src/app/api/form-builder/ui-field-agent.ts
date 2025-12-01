import { generateObject } from "ai";
import { uiFieldSchema } from "./ui-field-schema";

const systemPrompt = `
You generate UI form configuration.

Input: a JSON schema with:
{
  "fields": [
    { "name": string, "type": string, "required": boolean, "options"?: string[] }
  ]
}

Output must be:
{
  "fields": [
    {
      "id": string,
      "label": string,
      "component": "text" | "number" | "checkbox" | "select" | "date",
      "required": boolean,
      "options": string[]
    }
  ]
}

Mapping rules:
- id = name
- label = title case version of name
- required = same as schema
- component mapping:
    string -> text
    number -> number
    boolean -> checkbox
    date -> date
    enum -> select
- For enum, options must match schema options exactly.
- For non enum, options = [].
- Never omit required.
- Never omit options.
- Never generate extra fields.
- Output only JSON that matches the provided Zod schema.
`;

export async function uiFieldAgent(schemaObj: unknown) {
	const prompt = `
Convert this JSON schema into UI field configuration.

JSON Schema:
${JSON.stringify(schemaObj, null, 2)}
  `;

	console.log("UI AGENT RUN");

	try {
		const { object } = await generateObject({
			model: "openai/gpt-4.1-nano",
			system: systemPrompt,
			prompt,
			schema: uiFieldSchema,
		});

		return {
			ok: true,
			ui: object,
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
