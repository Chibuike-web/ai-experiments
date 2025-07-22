import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { FileWithId } from "./types";

const MAX_SIZE_IN_BYTES = 50 * 1024 * 1024;

export const useHandleMultipleFiles = () => {
	const [files, setFiles] = useState<FileWithId[]>([]);
	const [parsedText, setParsedText] = useState("");
	const [summary, setSummary] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [selectPdfId, setSelectPdfId] = useState("");
	const uploadRef = useRef<HTMLInputElement | null>(null);
	const onClear = (fileId: string) => {
		setFiles((prev) => prev.filter((item) => item.id !== fileId));
		setParsedText("");
		setSummary("");
		if (uploadRef.current) {
			uploadRef.current.value = "";
		}
	};

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = e.target.files;
		if (!selectedFiles) return;

		const filesArray = Array.from(selectedFiles);

		const hasNonPdfFiles = filesArray.some((file) => file.type !== "application/pdf");

		if (hasNonPdfFiles) {
			alert("Only PDF files are allowed.");
			setFiles([]);
			return;
		}

		const hasTooLargeFile = filesArray.some((file) => file.size > MAX_SIZE_IN_BYTES);

		if (hasTooLargeFile) {
			alert("File is too large. Maximum allowed size is 50MB.");
			setFiles([]);
			return;
		}

		const newFiles: FileWithId[] = filesArray.map((file) => ({
			id: uuidv4(),
			content: file,
		}));

		setFiles((prev) => {
			const updated = [...prev, ...newFiles];

			if (!selectPdfId && updated.length > 0) {
				setSelectPdfId(updated?.[0].id);
			}
			return updated;
		});
	};

	const handleSelectPdf = (pdfId: string) => {
		setSelectPdfId(pdfId);
	};

	const handleParse = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const file = files.find((f) => f.id === selectPdfId)?.content;
		console.log(file);
		if (!file) return;
		const formData: FormData = new FormData();
		formData.append("pdf", file);
		let result: { text: string } = { text: "" };
		setIsLoading(true);
		try {
			const response = await fetch("http://localhost:5000/parse-pdf", {
				method: "POST",
				body: formData,
			});

			result = await response.json();
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
			console.error(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return {
		onClear,
		handleFileChange,
		handleParse,
		handleSummarize,
		handleSelectPdf,
		isLoading,
		selectPdfId,
		files,
		summary,
		parsedText,
		uploadRef,
	};
};
