# Todo List Application ✅

[![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)](https://to-do-list-app.vercel.app/)
[![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/zustand-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://github.com/pmndrs/zustand)

## 📝 Description

A modern and intuitive **Todo List** application built with **Next.js**, **React**, **TypeScript**, **TailwindCSS**, and **Zustand** for state management. The application allows users to create, update, delete, and manage their tasks in a clean and modern interface.

Designed for productivity enthusiasts, busy professionals, and anyone looking to organize their tasks efficiently, this application offers a simple way to track your tasks with a user-friendly experience.

## ✨ Preview

<img src="https://github.com/venturelli-91/To-do-list/raw/main/todo_project.png" alt="Todo List Application Preview" width="600"/>

## 📌 Features

- ✅ **Add Tasks**: Users can easily add tasks to their list
- ✏️ **Edit Tasks**: Tasks can be updated with new information
- 🗑️ **Delete Tasks**: Easily remove completed or unwanted tasks
- ✔️ **Mark Tasks as Completed**: Toggle the completion status of tasks
- 📱 **Responsive Design**: Fully responsive for great experience on mobile and desktop
- 💾 **Persistent Storage**: Tasks are saved to localStorage
- 🌓 **Dark/Light Theme**: Toggle between light and dark modes
- 🎨 **Modern UI**: Beautiful interface with Flowbite components
- ⚡ **Fast Performance**: Leverages Next.js for optimized performance

## 🚀 Technologies Used

<div style="display: inline-flex; gap: 10px; align-items: center;">
  <img src="https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_dark_background.png" alt="Next.js" width="30" height="30"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="React" width="30" height="30"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="TypeScript" width="30" height="30"/>
  <img src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" alt="TailwindCSS" width="40" height="40"/>
</div>

### Tech Stack

- **Framework:** Next.js 15.1.4
- **UI Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Flowbite
- **State Management:** Zustand with persist middleware
- **Icons:** React Icons

## 🚢 Deployment

<a href="https://to-do-list-app.vercel.app/" target="_blank">
  <img src="https://logowik.com/content/uploads/images/vercel1868.jpg" alt="Vercel" width="40" height="40" style="border-radius: 50%; background-color: white;"/>
</a>

Access the live application: [Todo List App](https://to-do-list-woad-alpha-48.vercel.app/)

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 20 or higher
- npm, yarn, pnpm, or bun

### Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/venturelli-91/To-do-list.git
   ```

2. Navigate to the project directory:

   ```bash
   cd To-do-list/todo_list
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Access the application at http://localhost:3000

### Build

Create an optimized production build:

```bash
npm run build
npm start
```

### Linting

Check code quality:

```bash
npm run lint
```

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── AddTaskModal.tsx
│   ├── TaskCard.tsx
│   ├── TaskFooter.tsx
│   ├── TaskNavbar.tsx
│   └── TaskSidebar.tsx
├── pages/           # Next.js pages
│   ├── _app.tsx
│   ├── _document.tsx
│   └── index.tsx
├── store/           # Zustand state management
│   └── taskStore.ts
└── styles/          # Global styles
    └── globals.css
```

## 💡 Usage

1. **Add a task:** Click the "New Task" button and enter your task title
2. **Complete a task:** Click the checkbox next to a task to mark it as complete
3. **Delete a task:** Click the trash icon to remove a task
4. **Toggle theme:** Use the theme toggle button to switch between light and dark modes
5. **Toggle sidebar:** Click the hamburger menu to show/hide the sidebar

## 🌟 State Management

This application uses [Zustand](https://github.com/pmndrs/zustand) for state management with the persist middleware for automatic localStorage synchronization. Tasks are automatically saved and restored between sessions.

## 📊 Project Status

![Status](https://img.shields.io/badge/Status-Active-brightgreen)

## 👨‍💻 Contributing

Feel free to fork this repository and contribute!

## 📬 Contact

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/aurelioventurelli)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/venturelli-91)

---

## 📚 Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Flowbite React Documentation](https://flowbite-react.com)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

## 📄 License

MIT

---

**Developed by Aurélio Venturelli.**
