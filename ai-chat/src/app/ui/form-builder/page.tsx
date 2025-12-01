import FormBuilderClient from "./form-builder-client";

export default function FormBuilder() {
	return (
		<main className="max-w-xl mx-auto flex flex-col gap-4 py-10 px-6 xl:px-0">
			<div className="">
				<h1 className="text-4xl font-bold">Form Builder</h1>
				<p className="text-[18px] text-muted-foreground mt-2">
					Describe what information you want to collect and we’ll generate the form for it
				</p>
			</div>
			<FormBuilderClient />
		</main>
	);
}
