import express from "express";
import cors from "cors";
import { parseMultipartRequest, MultipartParseError } from "@mjackson/multipart-parser/node";

import dotenv from "dotenv";
import path from "path";
import { existsSync, writeFileSync, readFileSync, unlinkSync } from "fs";
import { mkdir } from "fs/promises";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const REMOVE_BG_KEY = process.env.REMOVE_BG_APIKEY;

const saveFile = (savePath, buffer) => {
	try {
		writeFileSync(savePath, buffer);
		console.log("File written successfully");
	} catch (err) {
		console.error("Failed to write file:", err);
	}
};
const uploadDir = path.resolve("uploads");

app.post("/upload", async (req, res) => {
	try {
		await mkdir(uploadDir, { recursive: true });
		for await (const part of parseMultipartRequest(req)) {
			if (part.isFile) {
				let arrayBuffer = part.arrayBuffer;
				const buffer = Buffer.from(arrayBuffer);
				console.log(`File received: ${part.filename} (${buffer.byteLength} bytes)`);
				console.log(`Content type: ${part.mediaType}`);
				console.log(`Field name: ${part.name}`);
				const savePath = path.join(uploadDir, part.filename);
				saveFile(savePath, buffer);
				res.status(200).json({
					message: "Upload successful",
					filename: part.filename,
					mimetype: part.mediaType,
					originalname: part.filename,
				});
			} else return;
		}
	} catch (err) {
		console.error(err);
		if (err instanceof MultipartParseError) {
			res.status(400).send("Invalid multipart data");
		} else {
			res.status(500).send("Server error");
		}
	}
});

app.post("/remove-bg", async (req, res) => {
	const { file } = req.body;
	if (!file.filename) return res.status(400).json({ message: "Missing filename" });
	const imagePath = path.resolve("uploads", file.filename);
	if (!existsSync(imagePath)) {
		return res.status(404).send("File not found.");
	}

	try {
		console.log("Image uploaded:", imagePath);

		const imageBuffer = readFileSync(imagePath);
		const blob = new Blob([imageBuffer], { type: file.mimetype });

		const formData = new FormData();
		formData.append("size", "auto");
		formData.append("image_file", blob, file.originalname);

		const response = await fetch("https://api.remove.bg/v1.0/removebg", {
			method: "POST",
			headers: {
				"X-Api-Key": REMOVE_BG_KEY,
			},
			body: formData,
		});

		unlinkSync(imagePath);

		if (!response.ok) {
			const errorText = await response.text();
			console.error("Remove.bg Error:", errorText);
			return res.status(500).send(errorText);
		}

		const buffer = await response.arrayBuffer();
		res.set("Content-Type", "image/png");
		res.send(Buffer.from(buffer));
	} catch (err) {
		console.error("Server error:", err);
		res.status(500).send("Unexpected server error");
	}
});

app.listen(3100, () => console.log("Server running on http://localhost:3100"));
