import ClientOnly from "@/components/client-only";
import ToolsClient from "./tools.client";

export default function Tools() {
	return (
		<main className=" w-full max-w-[600px] h-screen mx-auto mt-4 mb-80 px-6 xl:px-0">
			<ClientOnly>
				<ToolsClient />
			</ClientOnly>
		</main>
	);
}
