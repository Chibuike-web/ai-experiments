import ClientOnly from "@/components/client-only";
import CompletionClient from "./completion-client";

export default function Completion() {
	return (
		<ClientOnly>
			<CompletionClient />
		</ClientOnly>
	);
}
