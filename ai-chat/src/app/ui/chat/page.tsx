"use client";

import { Loader } from "@/components/ai-elements/loader";
import {
	PromptInput,
	PromptInputSubmit,
	PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { ChatStatus } from "ai";
import { useState } from "react";
import { useChat } from "@ai-sdk/react";

export default function ChatPage() {
	const [input, setInput] = useState("");

	const { messages, sendMessage, status, error, stop } = useChat();
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		sendMessage({ text: input });
		setInput("");
	};
	return (
		<main className=" w-full max-w-[600px] mx-auto mt-4">
			{error && <div className="text-red-500">{error.message}</div>}

			{messages.map((message) => (
				<div key={message.id}>
					<div>{message.role === "user" ? "You" : "AI"}</div>
					{message.parts.map((part, index) => {
						switch (part.type) {
							case "text":
								return <div key={`${message.id}-${index}`}>{part.text}</div>;
							default:
								return null;
						}
					})}
				</div>
			))}
			<div className=" w-full max-w-[600px] fixed bottom-8 left-1/2 -translate-x-1/2">
				<PromptInput className="mt-4" onSubmit={handleSubmit}>
					<PromptInputTextarea onChange={(e) => setInput(e.target.value)} value={input} />

					<div className="p-2 flex justify-self-end">
						<PromptInputSubmit
							disabled={!input && status !== "streaming"}
							status={status}
							onClick={(e) => {
								if (status === "streaming") {
									e.preventDefault();
									stop();
								}
							}}
						/>
					</div>
				</PromptInput>
			</div>
		</main>
	);
}
