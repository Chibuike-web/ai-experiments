import { useState, useRef } from "react";
import { ImageContainer } from "./Single";

export default function Multiple() {
	const [images, setImages] = useState([]);
	const fileInputRef = useRef(null);

	const handleFileChange = (e) => {
		const files = Array.from(e.target.files);
		const imageFiles = files.filter((file) => file.type.startsWith("image/"));
		if (imageFiles.length === 0) {
			alert("Please upload at least one image file");
			fileInputRef.current.value = "";
			return;
		}

		const imageURLs = imageFiles.map((imageFile) => URL.createObjectURL(imageFile));
		setImages((prev) => [...prev, ...imageURLs]);
	};
	return (
		<div>
			<label>
				<input type="file" multiple onChange={handleFileChange} ref={fileInputRef} />
			</label>

			<div className="grid grid-cols-3 max-w-[1080px] gap-4">
				{images.map((image, index) => (
					<ImageContainer key={index} image={image} index={index} />
				))}
			</div>
		</div>
	);
}
