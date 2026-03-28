import { TAG_COLORS, ALL_TAGS, type TagName } from "@/store/taskStore";
import { toggleTag } from "@/utils/tags";

interface TagInputProps {
	selected: TagName[];
	onChange: (tags: TagName[]) => void;
}

export default function TagInput({ selected, onChange }: TagInputProps) {
	const handleToggle = (tag: TagName) => toggleTag(tag, selected, onChange);

	return (
		<div className="space-y-2">
			<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
				Tags
			</label>
			<div className="flex flex-wrap gap-2">
				{ALL_TAGS.map((tag) => (
					<button
						key={tag}
						onClick={() => handleToggle(tag)}
						type="button"
						aria-pressed={selected.includes(tag)}
						className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
							selected.includes(tag)
								? TAG_COLORS[tag]
								: "border-2 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500"
						}`}>
						{tag}
					</button>
				))}
			</div>
		</div>
	);
}
