import type { NextApiRequest, NextApiResponse } from "next";
import { Anthropic } from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
	apiKey: process.env.ANTHROPIC_API_KEY,
});

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

	if (!process.env.ANTHROPIC_API_KEY) {
		return res.status(500).json({
			tags: [],
			confidence: 0,
			reason: "API key not configured",
		});
	}

	try {
		const message = await anthropic.messages.create({
			model: "claude-opus-4-6",
			max_tokens: 300,
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
		});

		const content = message.content[0];
		if (content.type !== "text") {
			throw new Error("Unexpected response format");
		}

		const parsed = JSON.parse(content.text);
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
