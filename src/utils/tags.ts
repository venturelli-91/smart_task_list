import { type TagName } from "@/store/taskStore";

export const toggleTag = (
	tag: TagName,
	selectedTags: TagName[],
	onUpdate: (tags: TagName[]) => void
): void => {
	if (selectedTags.includes(tag)) {
		onUpdate(selectedTags.filter((t) => t !== tag));
	} else {
		onUpdate([...selectedTags, tag]);
	}
};
