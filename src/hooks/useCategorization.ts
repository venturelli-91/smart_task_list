import { useState, useCallback } from "react";
import type { TagName } from "@/store/taskStore";

interface CategorizeResult {
	tags: TagName[];
	confidence: number;
	reason: string;
}

export function useCategorization() {
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<CategorizeResult | null>(null);

	const categorize = useCallback(async (taskTitle: string) => {
		if (!taskTitle.trim()) return;

		setLoading(true);

		try {
			const response = await fetch("/api/ai/categorize", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ taskTitle }),
			});

			if (!response.ok) throw new Error(`API error: ${response.statusText}`);

			const data = await response.json();
			setResult({
				tags: data.tags || [],
				confidence: data.confidence || 0,
				reason: data.reason || "",
			});
		} catch (error) {
			console.error("Categorization failed:", error);
			setResult(null);
		} finally {
			setLoading(false);
		}
	}, []);

	return { categorize, result, loading };
}
