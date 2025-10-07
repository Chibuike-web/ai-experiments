"use client";

import { Loader } from "@/components/ai-elements/loader";
import {
	PromptInput,
	PromptInputSubmit,
	PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { useCompletion } from "@ai-sdk/react";
import { ChatStatus } from "ai";
import { useEffect, useState } from "react";

export default function StructedDataPage() {
	const [dishName, setDishName] = useState("");
	const [status, setStatus] = useState<ChatStatus>("ready");
	const { input, handleInputChange, handleSubmit, completion, isLoading, error, setInput, stop } =
		useCompletion({
			api: "/api/stream",
			onFinish() {
				setStatus("ready");
			},
			onError() {
				setStatus("error");
			},
		});

	useEffect(() => {
		if (isLoading && status === "submitted") {
			setStatus("streaming");
		}
	}, [isLoading, status]);

	return (
		<main className=" w-full max-w-[600px] mx-auto mt-4">
			{error && <div className="text-red-500">{error.message}</div>}
			{isLoading && !completion && <Loader />}
			{completion && <div className="whitespace-pre-wrap">{completion}</div>}
			<div className=" w-full max-w-[600px] fixed bottom-8 left-1/2 -translate-x-1/2">
				<PromptInput
					className="mt-4"
					onSubmit={(e) => {
						e.preventDefault();
						handleSubmit();
						setInput("");
						setStatus("submitted");
					}}
				>
					<PromptInputTextarea onChange={handleInputChange} value={input} />

					<div className="p-2 flex justify-self-end">
						<PromptInputSubmit
							disabled={!input && status !== "streaming"}
							status={status}
							onClick={(e) => {
								if (status === "streaming") {
									e.preventDefault();
									stop();
									setStatus("ready");
								}
							}}
						/>
					</div>
				</PromptInput>
			</div>
		</main>
	);
}
