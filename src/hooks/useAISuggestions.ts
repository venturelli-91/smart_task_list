import { useState, useCallback } from "react";
import type { TagName } from "@/store/taskStore";

interface Suggestion {
	subtasks: string[];
	estimatedTags: TagName[];
	priority: "low" | "medium" | "high";
}

const VALID_TAGS = ["work", "personal", "urgent", "later", "learning"] as const;

export function useAISuggestions() {
	const [loading, setLoading] = useState(false);
	const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
	const [error, setError] = useState<string | null>(null);

	const generateSuggestions = useCallback(async (taskTitle: string) => {
		if (!taskTitle.trim()) return;

		setLoading(true);
		setError(null);
		setSuggestion(null);

		try {
			const response = await fetch("/api/ai/suggestions", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ taskTitle }),
			});

			if (!response.ok) {
				throw new Error(`API error: ${response.statusText}`);
			}

			const data = await response.json();
			setSuggestion({
				subtasks: data.subtasks || [],
				estimatedTags: (data.tags || []).filter((tag: string) =>
					VALID_TAGS.includes(tag as TagName)
				),
				priority: data.priority || "medium",
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to generate suggestions");
		} finally {
			setLoading(false);
		}
	}, []);

	const clearSuggestion = useCallback(() => {
		setSuggestion(null);
		setError(null);
	}, []);

	return {
		generateSuggestions,
		clearSuggestion,
		suggestion,
		loading,
		error,
	};
}
