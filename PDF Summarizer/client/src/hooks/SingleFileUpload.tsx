import { ChangeEvent, FormEvent, useRef, useState } from "react";

const MAXSIZEINBYTES = 50 * 1024 * 1024;
export default function useHandleFile() {
	const [file, setFile] = useState<File | null>(null);
	const [parsedText, setParsedText] = useState("");
	const [summary, setSummary] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const uploadRef = useRef<HTMLInputElement | null>(null);

	const onClear = () => {
		setFile(null);
		setParsedText("");
		setSummary("");
		if (uploadRef.current) {
			uploadRef.current.value = "";
		}
	};

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];

		if (!selectedFile || selectedFile.type !== "application/pdf") {
			alert("Please select a valid PDF file.");
			setFile(null);
			return;
		}
		if (selectedFile.size > MAXSIZEINBYTES) {
			alert("File is too large. Maximum allowed size is 50MB.");
			setFile(null);
			return;
		}
		setFile(selectedFile);
	};

	const handleParse = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!file) return;
		const formData: FormData = new FormData();
		formData.append("pdf", file);

		setIsLoading(true);
		try {
			const res = await fetch("http://localhost:5000/parse-pdf", {
				method: "POST",
				body: formData,
			});

			const result = await res.json();
			setParsedText(result.text);
		} catch (error) {
			console.error("Error uploading the file:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSummarize = async () => {
		if (!parsedText) return;
		setIsLoading(true);

		try {
			const res = await fetch("http://localhost:5000/summarize", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ text: parsedText }),
			});

			if (!res.ok) {
				throw new Error("Issue fetching summary");
			}

			const data = await res.json();
			setSummary(data.summary);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	return {
		file,
		isLoading,
		summary,
		parsedText,
		uploadRef,
		onClear,
		handleFileChange,
		handleParse,
		handleSummarize,
	};
}
