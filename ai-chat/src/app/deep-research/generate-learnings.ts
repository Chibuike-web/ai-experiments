import { generateText, Output } from "ai";
import { SearchResult } from "./search-web";
import z from "zod";

export const generateLearnings = async (query: string, searchResult: SearchResult) => {
	const result = await generateText({
		model: "openai/gpt-4o",
		prompt: `The user is researching ${query}. The following search result were deemed relevant.
    Generate a learning and a follow-up question from the following search result:
    <search_result>
    ${JSON.stringify(searchResult)}
    </search_result>`,
		output: Output.object({
			schema: z.object({
				learning: z.string(),
				followUpQuestions: z.array(z.string()),
			}),
		}),
	});
	return result.output;
};
