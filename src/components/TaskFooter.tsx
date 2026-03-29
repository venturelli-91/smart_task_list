import { memo } from "react";

const YEAR = new Date().getFullYear();

function TaskFooter() {
	return (
		<footer className="py-4 text-center text-xs text-slate-400 dark:text-slate-500">
			TaskFlow © {YEAR}
		</footer>
	);
}

export default memo(TaskFooter);
