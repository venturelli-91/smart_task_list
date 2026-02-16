import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Task {
	id: string;
	title: string;
	completed: boolean;
}

interface TaskStore {
	tasks: Task[];
	addTask: (title: string) => void;
	toggleTask: (id: string) => void;
	deleteTask: (id: string) => void;
}

const useTaskStore = create(
	persist<TaskStore>(
		(set) => ({
			tasks: [],
			addTask: (title) =>
				set((state) => ({
					tasks: [
						...state.tasks,
						{ id: crypto.randomUUID(), title, completed: false },
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
		}),
		{
			name: "task-storage",
		}
	)
);

export { useTaskStore };
export type { TaskStore };
