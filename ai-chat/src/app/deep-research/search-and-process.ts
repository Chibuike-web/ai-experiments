import { generateText, Output, tool } from "ai";
import { SearchResult, searchWeb } from "./search-web";
import z from "zod";

export const searchAndProcess = async (query: string) => {
	const pendingSearchResults: SearchResult[] = [];
	const finalSearchResults: SearchResult[] = [];
	await generateText({
		model: "openai/gpt-4o",
		prompt: "Search the web for the information about " + query,
		system:
			"You are a researcher. For each query, search the web and then evaluate if the results are relevant and will help answer the following query",
		maxRetries: 5,
		tools: {
			searchWeb: tool({
				description: "Search the web for the information about a given query",
				inputSchema: z.object({
					query: z.string().min(1),
				}),
				execute: async ({ query }) => {
					const results = await searchWeb(query);
					pendingSearchResults.push(...results);
				},
			}),
			evaluate: tool({
				description: "Evaluate the search results",
				inputSchema: z.object({}),
				execute: async () => {
					const pendingResult = pendingSearchResults.pop()!;
					const result = await generateText({
						model: "openai/gpt-4o",
						prompt: `Evaluate whether the search results are relevant and will help answer the following query: ${query}. If the page already exists in the existing results, mark it as irrelevant.
            <search_results>
            ${JSON.stringify(pendingResult)}
            </search_results>`,
						output: Output.choice({
							options: ["relevant", "irrelevant"],
						}),
					});
					if (result.output === "relevant") {
						finalSearchResults.push(pendingResult);
					}
					console.log("Found:", pendingResult.url);
					console.log("Evaluation completed:", result.output);
					return result.output === "irrelevant"
						? "Search results are irrelevant. Please search again with a more specific query."
						: "Search results are relevant. End research for this query.";
				},
			}),
		},
	});
	return finalSearchResults;
};
