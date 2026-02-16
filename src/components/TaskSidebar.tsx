import { Sidebar } from "flowbite-react";
import { HiChartPie, HiMenuAlt1 } from "react-icons/hi";

interface TaskSidebarProps {
	isOpen: boolean;
	toggleSidebar: () => void;
}

export default function TaskSidebar({
	isOpen,
	toggleSidebar,
}: TaskSidebarProps) {

	return (
		<>
			<button
				onClick={toggleSidebar}
				className={`fixed top-1.5 left-4 z-50 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-opacity duration-300 ${
					isOpen ? "opacity-0" : "opacity-100"
				}`}>
				<HiMenuAlt1 className="w-6 h-6 dark:text-white" />
			</button>
			<div
				className={`fixed transition-transform duration-300 ease-in-out ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}>
				<Sidebar
					aria-label="Sidebar with tasks navigation"
					className="h-screen">
					<Sidebar.Items>
						<Sidebar.ItemGroup>
							<Sidebar.Item href="/" icon={HiChartPie}>
								Tasks
							</Sidebar.Item>
						</Sidebar.ItemGroup>
					</Sidebar.Items>
				</Sidebar>
			</div>
		</>
	);
}
