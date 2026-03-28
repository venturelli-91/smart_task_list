# smart_task_list — CLAUDE.md

## Stack
- **Framework**: Next.js 15 (Pages Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + flowbite-react
- **State**: Zustand with persist middleware
- **Icons**: react-icons/hi

## Project Structure
```
src/
  components/   UI components (TaskCard, TaskNavbar, TaskSidebar, AddTaskModal, TaskFooter)
  pages/        Next.js pages (_app, _document, index)
  store/        Zustand stores (taskStore)
  styles/       Global CSS
```

## Skills Applied
This project uses the following skill guidelines:

### frontend-accessibility (WCAG 2.1 AA)
- Use semantic HTML elements (`nav`, `main`, `button`) instead of divs with onClick
- All interactive elements must have accessible names via text content or `aria-label`
- All form inputs must have associated `<label>` elements via `htmlFor`/`id`
- Modals require `role="dialog"`, `aria-modal`, `aria-labelledby`, and focus trapping
- Visible focus indicators must maintain 3:1 contrast ratio
- Never remove focus outlines; use custom `focus-visible` styles instead
- Error messages must be linked via `aria-describedby`

### vercel-react-best-practices
- Avoid inline object/array creation in JSX props (causes unnecessary re-renders)
- Use `useCallback` for event handlers passed to child components
- Prefer named exports for components (tree-shaking)
- Keep components small and focused — one responsibility per component
- State colocation: keep state as close to where it's used as possible

## Conventions
- **Language**: English only (code, comments, commit messages)
- **Commits**: Conventional commits (`feat:`, `fix:`, `refactor:`) — no Co-Authored-By trailer
- **No tests** unless explicitly asked
- **No extra comments/logs** — self-documenting code only
- **Minimum code** — no speculative abstractions, no extra error handling
- Do not commit, push, or open PRs without explicit instruction
- Ask before installing dependencies or deleting files

## Task Model
```ts
interface Task {
  id: string
  title: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
}
```

## Filter States
`'all' | 'active' | 'completed'` — managed in `taskStore`, not local state
