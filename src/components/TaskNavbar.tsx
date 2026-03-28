import { DarkThemeToggle } from "flowbite-react";
import { HiPlus } from "react-icons/hi";
import { useTaskStore } from "@/store/taskStore";

interface TaskNavbarProps {
	onNewTask: () => void;
}

export default function TaskNavbar({ onNewTask }: TaskNavbarProps) {
	const activeCount = useTaskStore((s) =>
		s.tasks.filter((t) => !t.completed).length
	);

	return (
		<header className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur border-b border-slate-100 dark:border-slate-700">
			<div>
				<h1 className="text-lg font-bold text-slate-800 dark:text-white">
					My Tasks
				</h1>
				{activeCount > 0 && (
					<p className="text-xs text-slate-500 dark:text-slate-400">
						{activeCount} task{activeCount !== 1 ? "s" : ""} remaining
					</p>
				)}
			</div>
			<div className="flex items-center gap-2">
				<DarkThemeToggle aria-label="Toggle dark mode" />
				<button
					onClick={onNewTask}
					aria-label="Add new task"
					className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2">
					<HiPlus className="w-4 h-4" aria-hidden="true" />
					New Task
				</button>
			</div>
		</header>
	);
}
