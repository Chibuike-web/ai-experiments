import { generateText, Output } from "ai";
import z from "zod";
import "dotenv/config";
import { searchAndProcess } from "./search-and-process";
import { generateLearnings } from "./generate-learnings";

export const generateSearchQueries = async (query: string, n: number = 3) => {
	const { output } = await generateText({
		model: "openai/gpt-4o",
		prompt: "Generate " + n + " search queries for the following query: " + query,
		output: Output.object({
			schema: z.object({
				queries: z.array(z.string()).min(1).max(5),
			}),
		}),
	});
	return output.queries;
};

const deepResearch = async (query: string, depth: number = 1, breadth: number = 3) => {
	const queries = await generateSearchQueries(query);

	for (const query of queries) {
		console.log("Searching the web for: " + query);
		const searchResults = await searchAndProcess(query);
		for (const searchResult of searchResults) {
			console.log("Processing search result: " + searchResult.url);
			const learnings = await generateLearnings(query, searchResult);
			// call deepResearch recursively with decrementing depth and breadth
		}
	}
};
const main = async () => {
	const prompt = "What do you need to be a D1 shotput athlete?";
	const research = await deepResearch(prompt);
};
main();
