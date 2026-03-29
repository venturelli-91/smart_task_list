import type { NextApiRequest, NextApiResponse } from "next";
import { Anthropic } from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
	apiKey: process.env.ANTHROPIC_API_KEY,
});

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

	if (!process.env.ANTHROPIC_API_KEY) {
		return res.status(500).json({
			error: "ANTHROPIC_API_KEY not configured",
			subtasks: [],
			tags: [],
			priority: "medium",
		});
	}

	try {
		const message = await anthropic.messages.create({
			model: "claude-opus-4-6",
			max_tokens: 500,
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
		});

		const content = message.content[0];
		if (content.type !== "text") {
			throw new Error("Unexpected response format");
		}

		const parsed = JSON.parse(content.text);

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
