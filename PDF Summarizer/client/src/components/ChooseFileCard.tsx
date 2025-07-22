import { UploadIcon } from "../Icons";

export const ChooseFileCard = ({ handleFileChange, uploadRef }) => {
	return (
		<label className="w-full relative block">
			<input
				type="file"
				accept="application/pdf"
				ref={uploadRef}
				onChange={handleFileChange}
				className="hidden"
				multiple
			/>

			<div className=" border border-gray-200 border-dashed rounded-[12px] w-full flex flex-col items-center p-8 bg-white">
				<UploadIcon />
				<p className="font-medium text-[14px] text-gray-950 mb-[6px] mt-[20px]">Choose a file</p>
				<p className="text-[12px] text-gray-600 mb-[20px]"> PDF format, up to 50MB</p>
				<span className="text-gray-600 px-[12px] py-[6px] text-[14px] border border-gray-200 rounded-[8px]">
					Browse File
				</span>
			</div>
		</label>
	);
};
