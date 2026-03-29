import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import TaskCard from "./TaskCard";
import { useTaskStore } from "@/store/taskStore";
import type { Task } from "@/store/taskStore";

// Mock zustand store
vi.mock("@/store/taskStore", async () => {
	const actual = await vi.importActual("@/store/taskStore");
	return {
		...actual,
		useTaskStore: vi.fn(),
	};
});

describe("TaskCard filtering", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("displays all tasks when filter is 'all'", () => {
		const tasks: Task[] = [
			{ id: "1", title: "Active task", completed: false, priority: "high", tags: [] },
			{ id: "2", title: "Completed task", completed: true, priority: "low", tags: [] },
		];

		(useTaskStore as any).mockReturnValue({
			tasks,
			filter: "all",
			selectedTags: [],
			toggleTask: vi.fn(),
			deleteTask: vi.fn(),
		});

		render(<TaskCard />);

		expect(screen.getByText("Active task")).toBeInTheDocument();
		expect(screen.getByText("Completed task")).toBeInTheDocument();
	});

	it("filters active tasks only when filter is 'active'", () => {
		const tasks: Task[] = [
			{ id: "1", title: "Active task", completed: false, priority: "high", tags: [] },
			{ id: "2", title: "Completed task", completed: true, priority: "low", tags: [] },
		];

		(useTaskStore as any).mockReturnValue({
			tasks,
			filter: "active",
			selectedTags: [],
			toggleTask: vi.fn(),
			deleteTask: vi.fn(),
		});

		render(<TaskCard />);

		expect(screen.getByText("Active task")).toBeInTheDocument();
		expect(screen.queryByText("Completed task")).not.toBeInTheDocument();
	});

	it("filters completed tasks only when filter is 'completed'", () => {
		const tasks: Task[] = [
			{ id: "1", title: "Active task", completed: false, priority: "high", tags: [] },
			{ id: "2", title: "Completed task", completed: true, priority: "low", tags: [] },
		];

		(useTaskStore as any).mockReturnValue({
			tasks,
			filter: "completed",
			selectedTags: [],
			toggleTask: vi.fn(),
			deleteTask: vi.fn(),
		});

		render(<TaskCard />);

		expect(screen.queryByText("Active task")).not.toBeInTheDocument();
		expect(screen.getByText("Completed task")).toBeInTheDocument();
	});

	it("filters tasks by selected tags (OR logic)", () => {
		const tasks: Task[] = [
			{ id: "1", title: "Work task", completed: false, priority: "high", tags: ["work"] },
			{ id: "2", title: "Personal task", completed: false, priority: "low", tags: ["personal"] },
			{ id: "3", title: "Untagged task", completed: false, priority: "medium", tags: [] },
		];

		(useTaskStore as any).mockReturnValue({
			tasks,
			filter: "all",
			selectedTags: ["work", "personal"],
			toggleTask: vi.fn(),
			deleteTask: vi.fn(),
		});

		render(<TaskCard />);

		expect(screen.getByText("Work task")).toBeInTheDocument();
		expect(screen.getByText("Personal task")).toBeInTheDocument();
		expect(screen.queryByText("Untagged task")).not.toBeInTheDocument();
	});

	it("shows empty state when no tasks match filters", () => {
		(useTaskStore as any).mockReturnValue({
			tasks: [
				{ id: "1", title: "Completed task", completed: true, priority: "low", tags: [] },
			],
			filter: "active",
			selectedTags: [],
			toggleTask: vi.fn(),
			deleteTask: vi.fn(),
		});

		render(<TaskCard />);

		expect(screen.getByText("All clear!")).toBeInTheDocument();
	});
});
