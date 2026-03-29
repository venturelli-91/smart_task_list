import { useEffect, useRef, useState } from "react";
import { HiX, HiSparkles } from "react-icons/hi";
import { useTaskStore, type Priority, type TagName } from "@/store/taskStore";
import { useCategorization } from "@/hooks/useCategorization";
import TagInput from "./TagInput";

interface AddTaskModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const PRIORITIES: Priority[] = ["low", "medium", "high"];

const PRIORITY_STYLES: Record<
	Priority,
	{ active: string; inactive: string }
> = {
	low: {
		active: "bg-emerald-100 border-emerald-400 text-emerald-700 dark:bg-emerald-900/40 dark:border-emerald-500 dark:text-emerald-300",
		inactive: "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500",
	},
	medium: {
		active: "bg-amber-100 border-amber-400 text-amber-700 dark:bg-amber-900/40 dark:border-amber-500 dark:text-amber-300",
		inactive: "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500",
	},
	high: {
		active: "bg-red-100 border-red-400 text-red-700 dark:bg-red-900/40 dark:border-red-500 dark:text-red-300",
		inactive: "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500",
	},
};

export default function AddTaskModal({ isOpen, onClose }: AddTaskModalProps) {
	const [title, setTitle] = useState("");
	const [priority, setPriority] = useState<Priority>("medium");
	const [tags, setTags] = useState<TagName[]>([]);
	const [error, setError] = useState("");
	const addTask = useTaskStore((s) => s.addTask);
	const { categorize, result: aiResult, loading: aiLoading } = useCategorization();
	const inputRef = useRef<HTMLInputElement>(null);
	const closeButtonRef = useRef<HTMLButtonElement>(null);
	const dialogRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isOpen) {
			inputRef.current?.focus();
			setTitle("");
			setPriority("medium");
			setTags([]);
			setError("");
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
				return;
			}

			if (e.key === "Tab" && isOpen && dialogRef.current) {
				const focusableElements = dialogRef.current.querySelectorAll(
					'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
				);
				const firstElement = focusableElements[0] as HTMLElement;
				const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

				if (e.shiftKey) {
					if (document.activeElement === firstElement) {
						e.preventDefault();
						lastElement?.focus();
					}
				} else {
					if (document.activeElement === lastElement) {
						e.preventDefault();
						firstElement?.focus();
					}
				}
			}
		};

		if (isOpen) document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [isOpen, onClose]);

	const handleSuggestTags = async () => {
		await categorize(title);
	};

	const handleAcceptSuggestions = () => {
		if (aiResult?.tags) {
			setTags(aiResult.tags);
			if (aiResult.priority && aiResult.priority !== priority) {
				setPriority(aiResult.priority);
			}
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim()) {
			setError("Task title is required.");
			inputRef.current?.focus();
			return;
		}
		addTask(title.trim(), priority, tags);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
			aria-describedby="modal-description"
			className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div
				className="absolute inset-0 bg-black/40 backdrop-blur-sm"
				onClick={onClose}
				aria-hidden="true"
			/>
			<div
				ref={dialogRef}
				className="relative z-10 w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
				<div className="flex items-center justify-between mb-5">
					<h2
						id="modal-title"
						className="text-lg font-bold text-slate-800 dark:text-white">
						New Task
					</h2>
					<button
						ref={closeButtonRef}
						onClick={onClose}
						aria-label="Close dialog (press Escape)"
						className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400">
						<HiX className="w-5 h-5" aria-hidden="true" />
					</button>
				</div>

				<p
					id="modal-description"
					className="sr-only">
					Fill in the task details below. Use Tab to navigate between fields,
					press Enter to submit, or Escape to cancel.
				</p>

				<form onSubmit={handleSubmit} noValidate className="space-y-5">
					<div>
						<label
							htmlFor="task-title"
							className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
							Title <span aria-label="required">*</span>
						</label>
						<div className="flex gap-2">
							<input
								ref={inputRef}
								id="task-title"
								type="text"
								value={title}
								onChange={(e) => {
									setTitle(e.target.value);
									if (error) setError("");
								}}
								placeholder="What needs to be done?"
								aria-describedby={error ? "title-error" : undefined}
								aria-invalid={!!error}
								aria-required="true"
								className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
							/>
							{title.trim() && (
								<button
									type="button"
									onClick={handleSuggestTags}
									disabled={aiLoading}
									aria-label="AI suggest tags and priority"
									className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-700 hover:to-violet-600 text-white font-medium text-sm disabled:opacity-60 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 shadow-md hover:shadow-lg">
									<HiSparkles className="w-4 h-4" />
									{aiLoading ? "Analyzing..." : "AI Suggest"}
								</button>
							)}
						</div>
						{error && (
							<p
								id="title-error"
								role="alert"
								className="mt-1.5 text-xs text-red-600 dark:text-red-400">
								{error}
							</p>
						)}
						{aiResult && (
							<div className="mt-3 p-3 rounded-xl bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/30 dark:to-violet-800/20 border-2 border-violet-300 dark:border-violet-600">
								<div className="flex items-start justify-between mb-2">
									<p className="font-semibold text-violet-900 dark:text-violet-200 flex items-center gap-1.5">
										<HiSparkles className="w-4 h-4" />
										AI Analysis
									</p>
									<span className="text-xs px-2 py-1 rounded-full bg-violet-200 text-violet-700 dark:bg-violet-700 dark:text-violet-200">
										{Math.round(aiResult.confidence * 100)}% confidence
									</span>
								</div>
								<p className="text-sm text-violet-800 dark:text-violet-300 mb-3 italic">
									"{aiResult.reason}"
								</p>
								{aiResult.tags.length > 0 && (
									<div>
										<p className="text-xs font-medium text-violet-700 dark:text-violet-400 mb-2">
											Suggested tags:
										</p>
										<div className="flex gap-2 mb-3 flex-wrap">
											{aiResult.tags.map((tag) => (
												<span
													key={tag}
													className="text-xs px-2 py-1 rounded-full bg-violet-600 text-white font-medium">
													{tag}
												</span>
											))}
										</div>
										<button
											type="button"
											onClick={handleAcceptSuggestions}
											className="w-full py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400">
											✓ Accept Suggestions
										</button>
									</div>
								)}
							</div>
						)}
					</div>

					<fieldset>
						<legend id="priority-legend" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
							Priority
						</legend>
						<div className="flex gap-2" role="group" aria-labelledby="priority-legend">
							{PRIORITIES.map((p) => (
								<label
									key={p}
									className={`flex-1 flex items-center justify-center py-2 rounded-xl border-2 cursor-pointer text-sm font-semibold capitalize transition-colors ${
										priority === p
											? PRIORITY_STYLES[p].active
											: PRIORITY_STYLES[p].inactive
									}`}>
									<input
										type="radio"
										name="priority"
										value={p}
										checked={priority === p}
										onChange={() => setPriority(p)}
										className="sr-only"
										aria-label={`Set priority to ${p}`}
									/>
									{p}
								</label>
							))}
						</div>
					</fieldset>

					<TagInput selected={tags} onChange={setTags} />

					<div className="flex gap-2 pt-1">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">
							Cancel
						</button>
						<button
							type="submit"
							className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2">
							Add Task
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
