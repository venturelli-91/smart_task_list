const YEAR = new Date().getFullYear();

export default function TaskFooter() {
	return (
		<footer className="py-4 text-center text-xs text-slate-400 dark:text-slate-500">
			TaskFlow © {YEAR}
		</footer>
	);
}
