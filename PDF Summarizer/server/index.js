import express from "express";
import fileUpload from "express-fileupload";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

const PORT = 5000;

app.use(fileUpload());

app.post("/parse-pdf", async (req, res) => {
	const pdfFile = req.files?.pdf;
	if (!pdfFile) {
		return res.status(400).json({ error: "No file uploaded" });
	}

	try {
		const data = await pdfParse(pdfFile.data);
		res.json({ text: data.text });
	} catch (error) {
		console.error("PDF parse error:", error);
		res.status(500).json({ error: "Failed to parse PDF" });
	}
});

app.post("/summarize", async (req, res) => {
	const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
	const { text } = req.body;
	if (!text) {
		return res.status(400).json({ error: "No text provided" });
	}

	try {
		const geminiResponse = await fetch(
			`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					contents: [
						{
							parts: [{ text: `Summarize the following:\n\n${text}` }],
						},
					],
				}),
			}
		);
		if (!geminiResponse.ok) {
			const errorText = await geminiResponse.text();
			console.error(`Gemini API Error (${geminiResponse.status}): ${errorText}`);
			return res
				.status(geminiResponse.status)
				.json({ error: "Failed to get summary from Gemini API", details: errorText });
		}

		const data = await geminiResponse.json();
		const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No summary found";
		res.json({ summary });
	} catch (error) {
		console.error("Summarization error:", error);
		res.status(500).json({ error: "Failed to summarize text" });
	}
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
