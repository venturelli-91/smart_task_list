import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Priority = "low" | "medium" | "high";
export type Filter = "all" | "active" | "completed";

export interface Task {
	id: string;
	title: string;
	completed: boolean;
	priority: Priority;
}

interface TaskStore {
	tasks: Task[];
	filter: Filter;
	addTask: (title: string, priority: Priority) => void;
	toggleTask: (id: string) => void;
	deleteTask: (id: string) => void;
	clearCompleted: () => void;
	setFilter: (filter: Filter) => void;
}

const useTaskStore = create(
	persist<TaskStore>(
		(set) => ({
			tasks: [],
			filter: "all",
			addTask: (title, priority) =>
				set((state) => ({
					tasks: [
						...state.tasks,
						{ id: crypto.randomUUID(), title, completed: false, priority },
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
		}),
		{
			name: "task-storage",
			partialize: (state) => ({ tasks: state.tasks }),
		}
	)
);

export { useTaskStore };
