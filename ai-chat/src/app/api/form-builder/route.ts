import { db } from "@/db";
import { schemaAgent } from "./schema-agent";
import { uiFieldAgent } from "./ui-field-agent";
import { form } from "@/db/schemas/form";

export async function POST(req: Request) {
	try {
		const { input } = await req.json();
		const schema = await schemaAgent(input);
		console.log(schema);
		const schemaRes = await schemaAgent(input);

		if (!schemaRes.ok) {
			return new Response(
				JSON.stringify({
					status: "failed",
					error: schemaRes.error || "Schema generation failed",
				}),
				{ status: 400 }
			);
		}

		const uiRes = await uiFieldAgent(schemaRes.schema ?? "");
		if (!uiRes.ok) {
			return new Response(
				JSON.stringify({
					status: "failed",
					error: uiRes?.error || "UI generation failed",
					details: uiRes?.details || null,
				}),
				{ status: 400 }
			);
		}

		console.log(uiRes.ui);
		const formData = await db
			.insert(form)
			.values({
				id: crypto.randomUUID(),
				prompt: input,
				jsonSchema: schemaRes.schema,
				uiSchema: uiRes.ui,
			})
			.returning();
		return new Response(
			JSON.stringify({ status: "success", content: uiRes.ui, id: formData[0].id }),
			{ status: 200 }
		);
	} catch (error) {
		return new Response(JSON.stringify({ status: "failed", error: "Unexpected error" }), {
			status: 500,
		});
	}
}
