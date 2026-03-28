"use client";
import { useState } from "react";
import TaskCard from "@/components/TaskCard";
import TaskNavbar from "@/components/TaskNavbar";
import TaskSidebar from "@/components/TaskSidebar";
import AddTaskModal from "@/components/AddTaskModal";

export default function Home() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const openModal = () => setIsModalOpen(true);

	return (
		<div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
			<TaskSidebar onNewTask={openModal} />
			<div className="flex-1 flex flex-col ml-72">
				<TaskNavbar onNewTask={openModal} />
				<main
					id="main-content"
					className="flex-1 p-6 max-w-3xl w-full mx-auto">
					<TaskCard />
				</main>
			</div>
			<AddTaskModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</div>
	);
}
