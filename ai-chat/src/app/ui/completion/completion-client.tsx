"use client";

import { Loader } from "@/components/ai-elements/loader";
import {
	PromptInput,
	PromptInputMessage,
	PromptInputSubmit,
	PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { FormEvent, useState } from "react";

export default function CompletionClient() {
	const [completion, setCompletion] = useState("");
	const [status, setStatus] = useState<"submitted" | "streaming" | "ready" | "error">("ready");
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (message: PromptInputMessage, e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setStatus("streaming");
		try {
			const response = await fetch("/api/completion", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ prompt: message.text }),
			});

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.error || "Something went wrong");
			}
			setCompletion(data.text);
		} catch (err) {
			console.log(err);
			setError(err instanceof Error ? err.message : "Something went wrong. Please try again");
		} finally {
			setStatus("ready");
		}
	};
	return (
		<main className=" w-full max-w-[600px] mx-auto mt-4 px-6 xl:px-0">
			{error && <div className="text-red-500">{error}</div>}
			{status === "streaming" ? (
				<Loader />
			) : completion ? (
				<div className="whitespace-pre-wrap">{completion}</div>
			) : null}

			<div className=" w-full max-w-[600px] fixed bottom-8 left-1/2 -translate-x-1/2">
				<PromptInput onSubmit={handleSubmit} className="mt-4">
					<PromptInputTextarea
						onChange={(e) => {
							setError("");
						}}
					/>

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
		</main>
	);
}
