export function toSentenceCase(input: string) {
	if (!input) return "";
	return input[0].toUpperCase() + input.slice(1);
}
