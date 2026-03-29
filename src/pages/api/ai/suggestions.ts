import type { NextApiRequest, NextApiResponse } from "next";

const HF_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2/v1/chat/completions";
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

interface SuggestionResponse {
	subtasks: string[];
	tags: string[];
	priority: "low" | "medium" | "high";
	error?: string;
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<SuggestionResponse>
) {
	if (req.method !== "POST") {
		return res.status(405).json({ subtasks: [], tags: [], priority: "medium" });
	}

	const { taskTitle } = req.body;

	if (!taskTitle || typeof taskTitle !== "string") {
		return res.status(400).json({
			error: "taskTitle is required",
			subtasks: [],
			tags: [],
			priority: "medium",
		});
	}

	if (!HF_API_KEY) {
		return res.status(500).json({
			error: "HUGGINGFACE_API_KEY not configured",
			subtasks: [],
			tags: [],
			priority: "medium",
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
						content: `Analyze this task and provide suggestions:

Task: "${taskTitle}"

Provide a JSON response with:
1. subtasks: array of 2-4 actionable subtasks (max 50 chars each)
2. tags: array of 0-2 tags from [work, personal, urgent, later, learning]
3. priority: "low", "medium", or "high"

Respond ONLY with valid JSON, no markdown.`,
					},
				],
				max_tokens: 500,
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

		res.status(200).json({
			subtasks: Array.isArray(parsed.subtasks) ? parsed.subtasks.slice(0, 4) : [],
			tags: Array.isArray(parsed.tags)
				? parsed.tags.filter((t: string) =>
						["work", "personal", "urgent", "later", "learning"].includes(t)
					)
				: [],
			priority:
				parsed.priority === "low" || parsed.priority === "high"
					? parsed.priority
					: "medium",
		});
	} catch (error) {
		console.error("AI suggestion error:", error);
		res.status(500).json({
			error: "Failed to generate suggestions",
			subtasks: [],
			tags: [],
			priority: "medium",
		});
	}
}
