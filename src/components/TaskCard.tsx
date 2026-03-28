import { HiTrash } from "react-icons/hi";
import { useTaskStore, type Priority } from "@/store/taskStore";

const PRIORITY_STYLES: Record<Priority, string> = {
	high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
	medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
	low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

export default function TaskCard() {
	const { tasks, filter, toggleTask, deleteTask } = useTaskStore();

	const filtered = tasks.filter((t) => {
		if (filter === "active") return !t.completed;
		if (filter === "completed") return t.completed;
		return true;
	});

	if (filtered.length === 0) {
		return (
			<div
				role="status"
				className="flex flex-col items-center justify-center py-24 text-slate-400 dark:text-slate-500">
				<span className="text-5xl mb-4" aria-hidden="true">✓</span>
				<p className="text-lg font-medium">
					{filter === "completed" ? "No completed tasks yet" : "All clear!"}
				</p>
				<p className="text-sm mt-1">
					{filter === "active" || filter === "all"
						? "Add a task to get started"
						: "Complete some tasks first"}
				</p>
			</div>
		);
	}

	return (
		<ul
			aria-label="Task list"
			className="space-y-2">
			{filtered.map((task) => (
				<li
					key={task.id}
					className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm group transition-colors hover:border-violet-200 dark:hover:border-violet-700">
					<input
						type="checkbox"
						id={`task-${task.id}`}
						checked={task.completed}
						onChange={() => toggleTask(task.id)}
						aria-label={`Mark "${task.title}" as ${task.completed ? "incomplete" : "complete"}`}
						className="w-5 h-5 rounded accent-violet-600 cursor-pointer flex-shrink-0"
					/>
					<label
						htmlFor={`task-${task.id}`}
						className={`flex-1 cursor-pointer text-sm font-medium select-none ${
							task.completed
								? "line-through text-slate-400 dark:text-slate-500"
								: "text-slate-800 dark:text-slate-100"
						}`}>
						{task.title}
					</label>
					<span
						aria-label={`Priority: ${task.priority}`}
						className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize flex-shrink-0 ${PRIORITY_STYLES[task.priority]}`}>
						{task.priority}
					</span>
					<button
						onClick={() => deleteTask(task.id)}
						aria-label={`Delete task: ${task.title}`}
						className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400">
						<HiTrash className="w-4 h-4" aria-hidden="true" />
					</button>
				</li>
			))}
		</ul>
	);
}
