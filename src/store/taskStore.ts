import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Priority = "low" | "medium" | "high";
export type Filter = "all" | "active" | "completed";

export const TAG_COLORS = {
	work: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
	personal: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
	urgent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
	later: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
	learning: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
} as const;

export type TagName = keyof typeof TAG_COLORS;

export const ALL_TAGS: TagName[] = Object.keys(TAG_COLORS) as TagName[];

export interface Task {
	id: string;
	title: string;
	completed: boolean;
	priority: Priority;
	tags: TagName[];
}

interface TaskStore {
	tasks: Task[];
	filter: Filter;
	selectedTags: TagName[];
	addTask: (title: string, priority: Priority, tags?: TagName[]) => void;
	toggleTask: (id: string) => void;
	deleteTask: (id: string) => void;
	clearCompleted: () => void;
	setFilter: (filter: Filter) => void;
	setSelectedTags: (tags: TagName[]) => void;
	updateTaskTags: (id: string, tags: TagName[]) => void;
}

const useTaskStore = create(
	persist<TaskStore>(
		(set) => ({
			tasks: [],
			filter: "all",
			selectedTags: [],
			addTask: (title, priority, tags = []) =>
				set((state) => ({
					tasks: [
						...state.tasks,
						{ id: crypto.randomUUID(), title, completed: false, priority, tags },
					],
				})),
			toggleTask: (id) =>
				set((state) => ({
					tasks: state.tasks.map((task) =>
						task.id === id ? { ...task, completed: !task.completed } : task
					),
				})),
			deleteTask: (id) =>
				set((state) => ({
					tasks: state.tasks.filter((task) => task.id !== id),
				})),
			clearCompleted: () =>
				set((state) => ({
					tasks: state.tasks.filter((task) => !task.completed),
				})),
			setFilter: (filter) => set({ filter }),
			setSelectedTags: (selectedTags) => set({ selectedTags }),
			updateTaskTags: (id, tags) =>
				set((state) => ({
					tasks: state.tasks.map((task) =>
						task.id === id ? { ...task, tags } : task
					),
				})),
		}),
		{
			name: "task-storage",
			partialize: (state) => ({ tasks: state.tasks }),
		}
	)
);

export { useTaskStore };
