import { useEffect, useRef, useState } from "react";
import { HiX } from "react-icons/hi";
import { useTaskStore, type Priority, type TagName } from "@/store/taskStore";
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
							className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
						/>
						{error && (
							<p
								id="title-error"
								role="alert"
								className="mt-1.5 text-xs text-red-600 dark:text-red-400">
								{error}
							</p>
						)}
					</div>

					<fieldset>
						<legend className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
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
