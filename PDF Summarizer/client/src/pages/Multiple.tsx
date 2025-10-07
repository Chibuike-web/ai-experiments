import ChooseFileCard from "../components/ChooseFileCard";
import FileUploadCard from "../components/FileUploadCard";
import useHandleMultipleFiles from "../hooks/MultipleFileUploads";

export default function Multiple() {
	const {
		onClear,
		handleFileChange,
		handleParse,
		handleSummarize,
		handleSelectPdf,
		selectPdfId,
		isLoading,
		files,
		summary,
		parsedText,
		uploadRef,
	} = useHandleMultipleFiles();

	return (
		<main className="grid grid-cols-[350px_1fr] w-full h-screen">
			<aside className="p-6 bg-gray-100 h-full flex flex-col gap-6">
				<form className="w-full flex flex-col gap-8" onSubmit={handleParse}>
					<ChooseFileCard handleFileChange={handleFileChange} uploadRef={uploadRef} />
					{!parsedText && (
						<button type="submit" className="bg-black text-white px-4 py-2 rounded">
							{isLoading ? "Parsing..." : "Parse PDF"}
						</button>
					)}
					{parsedText && !summary && (
						<button
							type="button"
							onClick={handleSummarize}
							className="bg-blue-600 text-white px-4 py-2 rounded"
						>
							{isLoading ? "Summarizing..." : "Summarize"}
						</button>
					)}
				</form>
				<div className="flex flex-col gap-2">
					{files?.map((file) => (
						<FileUploadCard
							key={file.id}
							id={file.id}
							file={file.content}
							handleSelectPdf={handleSelectPdf}
							selectPdf={selectPdfId}
							onClear={() => onClear(file.id)}
						/>
					))}
				</div>
			</aside>
		</main>
	);
}
