"use client";
import { useState } from "react";
import { DarkThemeToggle, Flowbite } from "flowbite-react";
import TaskCard from "@/components/TaskCard";
import TaskFooter from "@/components/TaskFooter";
import TaskNavbar from "@/components/TaskNavbar";
import TaskSidebar from "@/components/TaskSidebar";
import AddTaskModal from "@/components/AddTaskModal";

export default function Home() {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<Flowbite>
			<div className="flex min-h-screen bg-white dark:bg-gray-900">
				<TaskSidebar
					isOpen={isSidebarOpen}
					toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
				/>
				<div
					className={`flex-1 transition-all duration-300 ease-in-out bg-white dark:bg-gray-900 ${
						isSidebarOpen ? "ml-64" : "ml-0"
					}`}>
					<TaskNavbar />
					<div className="flex justify-center">
						<button
							onClick={() => setIsModalOpen(true)}
							className="m-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
							New Task
						</button>
					</div>
					<div className="text-gray-900 dark:text-white font-bold">
						<TaskCard />
						<DarkThemeToggle />
						<TaskFooter />
					</div>
				</div>
			</div>
			<AddTaskModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</Flowbite>
	);
}
