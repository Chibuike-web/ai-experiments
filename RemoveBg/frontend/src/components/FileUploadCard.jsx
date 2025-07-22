import { CancelIcon, FileFormatIcon } from "../Icons";
import { formatFileSize } from "../utils";

export const FileUploadCard = ({ index, file, onClear, selectImage, handleSelect }) => {
	if (!file) return null;

	return (
		<div
			className={`border  rounded-[12px] p-4 bg-white ${
				selectImage === index ? "border-blue-500" : "border-gray-200"
			}`}
			onClick={handleSelect}
		>
			<div className="flex justify-between items-center">
				<div className="flex items-center gap-4">
					<FileFormatIcon />
					<div>
						<p className="text-sm font-medium text-gray-800">{file.name}</p>
						<p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
					</div>
				</div>
				<button type="button" onClick={onClear}>
					<CancelIcon />
				</button>
			</div>
		</div>
	);
};
