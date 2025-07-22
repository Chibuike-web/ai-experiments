import { useState, useRef } from "react";
import { FileUploadCard } from "../components/FileUploadCard";
import { ChooseFileCard } from "../components/ChooseFileUpload";

const maxSizeInBytes = 50 * 1024 * 1024;

export default function Single() {
	const [images, setImages] = useState([]);
	const [uploadedImage, setUploadedImage] = useState([]);
	const [noBgImage, setNoBgImage] = useState("");
	const [selectImage, setSelectImage] = useState(0);

	const inputRef = useRef(null);

	const handleFileChange = (e) => {
		const selectedImage = e.target.files[0];
		if (!selectedImage.type.startsWith("image/")) {
			alert("Please upload an image file.");
			e.target.value = "";
			return;
		}

		if (selectedImage.size > maxSizeInBytes) {
			alert("File is too large. Maximum allowed size is 50MB.");
			e.target.value = "";
			return;
		}
		const imgUrl = URL.createObjectURL(selectedImage);
		setImages((prev) => [...prev, { file: selectedImage, url: imgUrl, uploaded: false }]);
	};

	const handleSelect = (index) => {
		setSelectImage(index);
		setUploadedImage([]);
	};

	const handleUpload = async () => {
		if (images.length === 0 || selectImage === null) {
			alert("Please choose a file first.");
			return;
		}

		const formData = new FormData();
		formData.append("image", images[selectImage].file);

		try {
			const res = await fetch("http://localhost:3100/upload", {
				method: "POST",
				body: formData,
			});

			if (!res.ok) {
				throw new Error("Issue uploading image");
			}
			const data = await res.json();
			setUploadedImage((prev) => [
				...prev,
				{
					url: images[selectImage].url,
					file: {
						filename: data.filename,
						mimetype: data.mimetype,
						originalname: data.originalname,
					},
				},
			]);
			const updatedImage = images.map((image, index) =>
				index === selectImage ? { ...image, uploaded: true } : image
			);
			setImages(updatedImage);
		} catch (err) {
			console.error("Issue uploading image", err);
		}
	};

	const handleRemoveBg = async () => {
		if (uploadedImage.length === 0) return;

		try {
			const res = await fetch("http://localhost:3100/remove-bg", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ file: uploadedImage[selectImage].file }),
			});
			if (!res.ok) {
				const err = await res.text();
				throw new Error(err || "Issue fetching image");
			}

			const blob = await res.blob();
			const url = URL.createObjectURL(blob);
			setNoBgImage(url);
		} catch (error) {
			console.error("Issue fetching image", error);
		}
	};

	const handleClear = (index) => {
		setImages((prev) => {
			inputRef.current.value = "";
			const updated = prev.filter((_, i) => i !== index);

			setSelectImage((prev) => {
				if (updated.length === 0) return null;
				if (index === prev) {
					if (index === 0) {
						return index;
					} else {
						return index - 1;
					}
				}
				return prev;
			});

			return updated;
		});
	};

	return (
		<main className="grid grid-cols-[350px_1fr] w-full h-screen">
			<aside className="p-6 bg-gray-100 h-full">
				<div className="flex flex-col">
					<ChooseFileCard handleFileChange={handleFileChange} inputRef={inputRef} />
					{!images[selectImage]?.uploaded ? (
						<button
							type="button"
							onClick={handleUpload}
							className="bg-black text-white px-4 py-2 rounded mt-8"
						>
							Upload Image
						</button>
					) : (
						<button
							type="button"
							onClick={handleRemoveBg}
							className="bg-blue-500 text-white px-4 py-2 rounded mt-8"
						>
							Remove Background
						</button>
					)}
				</div>
				<div className="flex flex-col gap-2 mt-12">
					{images.map((img, index) => (
						<FileUploadCard
							key={index}
							index={index}
							file={img.file}
							onClear={() => handleClear(index)}
							selectImage={selectImage}
							handleSelect={() => handleSelect(index)}
						/>
					))}
				</div>
			</aside>
			<aside className="w-full flex px-10 gap-6">
				{images[selectImage]?.uploaded && (
					<ImageContainer
						key={images[selectImage].file.filename}
						image={images[selectImage].url}
						index={selectImage}
					/>
				)}

				{noBgImage && (
					<figure className="w-full max-w-[1100px]">
						<img
							src={noBgImage}
							alt="No background preview"
							className="w-full h-full object-cover"
						/>
					</figure>
				)}
			</aside>
		</main>
	);
}

export const ImageContainer = ({ image, index }) => {
	return (
		<figure className="size-[500px]">
			<img src={image} alt={`Preview ${index}`} className="w-full h-full object-contain" />
		</figure>
	);
};
