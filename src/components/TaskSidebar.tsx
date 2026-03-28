import { HiViewList, HiCheck, HiClipboardList, HiPlus, HiTrash } from "react-icons/hi";
import { useTaskStore, type Filter, TAG_COLORS, type TagName } from "@/store/taskStore";

const FILTERS: { value: Filter; label: string; icon: React.ReactNode }[] = [
	{ value: "all", label: "All Tasks", icon: <HiClipboardList aria-hidden="true" /> },
	{ value: "active", label: "Active", icon: <HiViewList aria-hidden="true" /> },
	{ value: "completed", label: "Completed", icon: <HiCheck aria-hidden="true" /> },
];

interface TaskSidebarProps {
	onNewTask: () => void;
}

export default function TaskSidebar({ onNewTask }: TaskSidebarProps) {
	const { tasks, filter, selectedTags, setFilter, setSelectedTags, clearCompleted } =
		useTaskStore();

	const stats = tasks.reduce(
		(acc, t) => ({
			all: acc.all + 1,
			active: acc.active + (t.completed ? 0 : 1),
			completed: acc.completed + (t.completed ? 1 : 0),
		}),
		{ all: 0, active: 0, completed: 0 }
	);

	const tagsInUse = Array.from(
		new Set(tasks.flatMap((t) => t.tags))
	) as TagName[];

	const toggleTag = (tag: TagName) => {
		if (selectedTags.includes(tag)) {
			setSelectedTags(selectedTags.filter((t) => t !== tag));
		} else {
			setSelectedTags([...selectedTags, tag]);
		}
	};

	return (
		<nav
			aria-label="Task navigation"
			className="fixed top-0 left-0 h-full w-72 bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 flex flex-col p-5 gap-6">
			<div className="flex items-center gap-2 pt-1">
				<span className="text-2xl" aria-hidden="true">✅</span>
				<span className="text-xl font-bold text-slate-800 dark:text-white">
					TaskFlow
				</span>
			</div>

			<button
				onClick={onNewTask}
				aria-label="Create new task"
				className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400">
				<HiPlus className="w-4 h-4" aria-hidden="true" />
				New Task
			</button>

			<div>
				<p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-1">
					Views
				</p>
				<ul className="space-y-1">
					{FILTERS.map(({ value, label, icon }) => (
						<li key={value}>
							<button
								onClick={() => setFilter(value)}
								aria-current={filter === value ? "page" : undefined}
								className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
									filter === value
										? "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
										: "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
								}`}>
								<span className="flex items-center gap-2">
									{icon}
									{label}
								</span>
								<span
									className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
										filter === value
											? "bg-violet-200 text-violet-700 dark:bg-violet-800 dark:text-violet-200"
											: "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
									}`}>
									{stats[value]}
								</span>
							</button>
						</li>
					))}
				</ul>
			</div>

			{tagsInUse.length > 0 && (
				<div>
					<p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-1">
						Tags
					</p>
					<div className="flex flex-wrap gap-1.5">
						{tagsInUse.map((tag) => (
							<button
								key={tag}
								onClick={() => toggleTag(tag)}
								type="button"
								aria-pressed={selectedTags.includes(tag)}
								className={`text-xs px-2 py-1 rounded-full font-semibold capitalize transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
									selectedTags.includes(tag)
										? TAG_COLORS[tag]
										: "border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500"
								}`}>
								{tag}
							</button>
						))}
					</div>
				</div>
			)}

			<div className="mt-auto">
				{stats.completed > 0 && (
					<button
						onClick={clearCompleted}
						aria-label={`Clear ${stats.completed} completed task${stats.completed !== 1 ? "s" : ""}`}
						className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400">
						<HiTrash className="w-4 h-4" aria-hidden="true" />
						Clear completed ({stats.completed})
					</button>
				)}
				<p className="text-xs text-slate-400 dark:text-slate-500 px-3 pt-3">
					{stats.all} total · {stats.active} active · {stats.completed} done
				</p>
			</div>
		</nav>
	);
}
