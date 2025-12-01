import ClientOnly from "@/components/client-only";
import ChatClient from "./chat-client";

export default function Chat() {
	return (
		<main className=" w-full max-w-[600px] min-h-screen mx-auto mt-4 px-6 xl:px-0 pb-40">
			<ClientOnly>
				<ChatClient />
			</ClientOnly>
		</main>
	);
}
