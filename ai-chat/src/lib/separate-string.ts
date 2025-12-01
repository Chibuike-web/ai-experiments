export function separateString(input: string) {
	let currentWord = "";
	let words: string[] = [];
	for (let i = 0; i < input.length; i++) {
		if (input[i] === input[i].toUpperCase() && i !== 0) {
			words.push(currentWord);
			currentWord = "";
		}
		currentWord += input[i];
	}
	words.push(currentWord);

	return words.join(" ");
}
