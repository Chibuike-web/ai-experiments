import ClientOnly from "@/components/client-only";
import FormBuilderClient from "./form-builder-client";

export default function FormBuilder() {
	return (
		<ClientOnly>
			<FormBuilderClient />
		</ClientOnly>
	);
}
