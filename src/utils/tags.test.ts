import { describe, it, expect, vi } from "vitest";
import { toggleTag } from "./tags";
import type { TagName } from "@/store/taskStore";

describe("toggleTag utility", () => {
	it("removes tag when already selected", () => {
		const onUpdate = vi.fn();
		const selected: TagName[] = ["work", "urgent"];

		toggleTag("work", selected, onUpdate);

		expect(onUpdate).toHaveBeenCalledWith(["urgent"]);
	});

	it("adds tag when not selected", () => {
		const onUpdate = vi.fn();
		const selected: TagName[] = ["work"];

		toggleTag("personal", selected, onUpdate);

		expect(onUpdate).toHaveBeenCalledWith(["work", "personal"]);
	});

	it("adds first tag to empty array", () => {
		const onUpdate = vi.fn();
		const selected: TagName[] = [];

		toggleTag("learning", selected, onUpdate);

		expect(onUpdate).toHaveBeenCalledWith(["learning"]);
	});

	it("removes last tag leaving empty array", () => {
		const onUpdate = vi.fn();
		const selected: TagName[] = ["urgent"];

		toggleTag("urgent", selected, onUpdate);

		expect(onUpdate).toHaveBeenCalledWith([]);
	});
});
