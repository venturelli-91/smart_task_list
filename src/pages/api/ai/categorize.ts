import type { NextApiRequest, NextApiResponse } from "next";

const HF_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2/v1/chat/completions";
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

interface CategorizeResponse {
	tags: string[];
	confidence: number;
	reason: string;
	error?: string;
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<CategorizeResponse>
) {
	if (req.method !== "POST") {
		return res.status(405).json({
			tags: [],
			confidence: 0,
			reason: "Method not allowed",
		});
	}

	const { taskTitle } = req.body;

	if (!taskTitle || typeof taskTitle !== "string") {
		return res.status(400).json({
			tags: [],
			confidence: 0,
			reason: "taskTitle is required",
		});
	}

	if (!HF_API_KEY) {
		return res.status(500).json({
			tags: [],
			confidence: 0,
			reason: "HUGGINGFACE_API_KEY not configured",
		});
	}

	try {
		const response = await fetch(HF_API_URL, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${HF_API_KEY}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				messages: [
					{
						role: "user",
						content: `Automatically categorize this task title:

"${taskTitle}"

Suggest the most appropriate tags from: work, personal, urgent, later, learning

Respond ONLY with JSON format:
{
  "tags": ["tag1", "tag2"],
  "confidence": 0.95,
  "reason": "brief explanation"
}`,
					},
				],
				max_tokens: 300,
			}),
		});

		if (!response.ok) {
			throw new Error(`HF API error: ${response.statusText}`);
		}

		const data = await response.json();
		const text = data.choices?.[0]?.message?.content;

		if (!text) {
			throw new Error("No content in response");
		}

		const parsed = JSON.parse(text);
		const validTags = ["work", "personal", "urgent", "later", "learning"];
		const tags = Array.isArray(parsed.tags)
			? parsed.tags.filter((t: string) => validTags.includes(t))
			: [];

		res.status(200).json({
			tags,
			confidence: Math.min(Math.max(parsed.confidence || 0, 0), 1),
			reason: parsed.reason || "",
		});
	} catch (error) {
		console.error("Categorization error:", error);
		res.status(500).json({
			tags: [],
			confidence: 0,
			reason: "Failed to categorize task",
		});
	}
}
