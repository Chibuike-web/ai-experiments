import { db } from "@/db";
import { schemaAgent } from "./schema-agent";
import { uiFieldAgent } from "./ui-field-agent";
import { form } from "@/db/schemas/form";
import { formTitleAgent } from "./form-title-agent";

export async function POST(req: Request) {
	try {
		const { input } = await req.json();

		if (!input || typeof input !== "string") {
			return new Response(JSON.stringify({ status: "failed", error: "Invalid input" }), {
				status: 400,
			});
		}

		const [titleRes, schemaRes] = await Promise.all([formTitleAgent(input), schemaAgent(input)]);

		if (!titleRes.ok || !titleRes.title) {
			return new Response(JSON.stringify({ status: "failed", error: titleRes.error }), {
				status: 400,
			});
		}

		if (!schemaRes.ok || !schemaRes.schema) {
			return new Response(
				JSON.stringify({
					status: "failed",
					error: schemaRes.error || "Schema generation failed",
				}),
				{ status: 400 }
			);
		}

		const uiRes = await uiFieldAgent(schemaRes.schema);

		if (!uiRes.ok || !uiRes.ui) {
			return new Response(
				JSON.stringify({
					status: "failed",
					error: uiRes?.error || "UI generation failed",
					details: uiRes?.details || null,
				}),
				{ status: 400 }
			);
		}

		const [created] = await db
			.insert(form)
			.values({
				id: crypto.randomUUID(),
				title: titleRes.title,
				prompt: input,
				jsonSchema: schemaRes.schema,
				uiSchema: uiRes.ui,
			})
			.returning({ id: form.id });

		return new Response(
			JSON.stringify({
				status: "success",
				ui: uiRes.ui,
				id: created.id,
				title: titleRes.title,
			}),
			{ status: 200 }
		);
	} catch (error) {
		return new Response(JSON.stringify({ status: "failed", error: "Unexpected error" }), {
			status: 500,
		});
	}
}
