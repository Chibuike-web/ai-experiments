"use client";

import { Loader } from "@/components/ai-elements/loader";
import {
	PromptInput,
	PromptInputSubmit,
	PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { useCompletion } from "@ai-sdk/react";

export default function StreamPage() {
	const { input, handleInputChange, handleSubmit, completion, isLoading, error, setInput } =
		useCompletion({
			api: "/api/stream",
		});

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
					}}
				>
					<PromptInputTextarea onChange={handleInputChange} value={input} />

					<div className="p-2 flex justify-self-end">
						{isLoading ? (
							<PromptInputSubmit disabled={!input || isLoading} />
						) : (
							<PromptInputSubmit disabled={!input || isLoading} />
						)}
					</div>
				</PromptInput>
			</div>
		</main>
	);
}
