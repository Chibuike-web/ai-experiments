"use client";

import {
	PromptInput,
	PromptInputMessage,
	PromptInputSubmit,
	PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/ai-elements/loader";
import { Conversation, ConversationContent } from "@/components/ai-elements/conversation";

export default function ChatClient() {
	const { messages, sendMessage, status, error, stop } = useChat();
	const handleSubmit = (message: PromptInputMessage, event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		sendMessage({ text: message.text });
	};
	return (
		<>
			<Conversation>
				<ConversationContent>
					{messages.map((message) => {
						const isLast = messages[messages.length - 1]?.id === message.id;
						const isAssistant = message.role === "assistant";
						const isStreaming = status === "streaming";
						return (
							<div key={message.id} className="flex flex-col gap-2">
								<Message from={message.role}>
									<div
										className={cn(
											"flex flex-col",
											message.role === "user" ? "items-end" : "items-start"
										)}
									>
										{message.role === "user" ? "You" : "AI"}
										{isAssistant && isLast && isStreaming && message.parts.length === 0 ? (
											<Loader />
										) : (
											<MessageContent>
												{message.parts.map((part, index) => {
													switch (part.type) {
														case "text":
															return (
																<MessageResponse key={`${message.id}-${index}`}>
																	{part.text}
																</MessageResponse>
															);
														default:
															return null;
													}
												})}
											</MessageContent>
										)}
									</div>
								</Message>
							</div>
						);
					})}
				</ConversationContent>
			</Conversation>
			{error && <div className="text-red-500">{error.message}</div>}

			<div className=" w-full max-w-[600px] fixed bottom-8 left-1/2 -translate-x-1/2 px-6 xl:px-0">
				<PromptInput className="mt-4" onSubmit={handleSubmit}>
					<PromptInputTextarea />

					<div className="p-2 flex justify-self-end">
						<PromptInputSubmit
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
		</>
	);
}
