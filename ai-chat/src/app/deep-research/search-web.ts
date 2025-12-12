import Exa from "exa-js";
import "dotenv/config";

const exa = new Exa(process.env.EXA_API_KEY);

export type SearchResult = {
	title: string;
	url: string;
	content: string;
};

export const searchWeb = async (query: string) => {
	const { results } = await exa.search(query, {
		numResults: 1,
	});

	return results.map(
		(r) =>
			({
				title: r.title,
				url: r.url,
				content: r.text,
			} as SearchResult)
	);
};
