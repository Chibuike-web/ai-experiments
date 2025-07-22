import { CancelIcon, FileFormatIcon } from "../Icons";
import { formatFileSize } from "../utils";

type FileUploadCardProps = {
	file: File;
	id?: string;
	handleSelectPdf?: (id: string) => void;
	selectPdf?: string;
	onClear: () => void;
};

export const FileUploadCard = ({
	id,
	file,
	onClear,
	handleSelectPdf,
	selectPdf,
}: FileUploadCardProps) => {
	if (!file) return null;

	const isSelected = id && id === selectPdf;

	return (
		<div
			className={`border rounded-[12px] p-4 bg-white ${
				id && id === selectPdf ? "border-blue-500" : "border-gray-200"
			}`}
		>
			<div
				className="flex justify-between items-center"
				onClick={() => {
					if (id && handleSelectPdf) {
						handleSelectPdf(id);
					}
				}}
			>
				<div className="flex items-center gap-4">
					<FileFormatIcon />
					<div>
						<p className="text-sm font-medium text-gray-800">{file.name}</p>
						<p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
					</div>
				</div>
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						onClear();
					}}
				>
					<CancelIcon />
				</button>
			</div>
		</div>
	);
};
