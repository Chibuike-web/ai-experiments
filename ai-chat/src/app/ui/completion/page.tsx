"use client";

import { Loader } from "@/components/ai-elements/loader";
import {
	PromptInput,
	PromptInputSubmit,
	PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import React, { FormEvent, useState } from "react";

export default function CompletionPage() {
	const [prompt, setPrompt] = useState("");
	const [completion, setCompletion] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		setIsLoading(true);
		try {
			const response = await fetch("/api/completion", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ prompt }),
			});

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.error || "Something went wrong");
			}
			setCompletion(data.text);
			setPrompt("");
		} catch (err) {
			console.log(err);
			setError(err instanceof Error ? err.message : "Something went wrong. Please try again");
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<main className=" w-full max-w-[600px] mx-auto mt-4">
			{error && <div className="text-red-500">{error}</div>}
			{isLoading ? (
				<Loader />
			) : completion ? (
				<div className="whitespace-pre-wrap">{completion}</div>
			) : null}

			<div className=" w-full max-w-[600px] fixed bottom-8 left-1/2 -translate-x-1/2">
				<PromptInput onSubmit={handleSubmit} className="mt-4">
					<PromptInputTextarea onChange={(e) => setPrompt(e.target.value)} value={prompt} />

					<div className="p-2 flex justify-self-end">
						<PromptInputSubmit disabled={!prompt || isLoading} />
					</div>
				</PromptInput>
			</div>
		</main>
	);
}
