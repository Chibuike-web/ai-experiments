import ClientOnly from "@/components/client-only";
import FormPageClient from "./form-page-client";
import { Suspense } from "react";
import { db } from "@/db";
import { form } from "@/db/schemas";
import { eq } from "drizzle-orm";
import { UIType } from "../form-builder-client";

export default async function FormPage({ params }: { params: Promise<{ id: string }> }) {
	return (
		<main className="max-w-xl mx-auto py-10 px-6 xl:px-0">
			<Suspense>
				<Main params={params} />
			</Suspense>
		</main>
	);
}

const Main = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;
	const result = await db.query.form.findFirst({
		where: eq(form.id, id),
		columns: {
			uiSchema: true,
			title: true,
		},
	});
	if (!result) {
		return <div>Form not found</div>;
	}

	const uiSchema = result.uiSchema as { fields: UIType[] };
	const title = result.title;

	return (
		<>
			<h2 className="text-2xl font-semibold mb-4">{title}</h2>
			<ClientOnly>
				<FormPageClient ui={uiSchema.fields} />
			</ClientOnly>
		</>
	);
};
