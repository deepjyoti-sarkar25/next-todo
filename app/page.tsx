import { TodoProvider } from '@/contexts/TodoContext';
import TodoInput from '@/components/TodoInput';
import TodoList from '@/components/TodoList';

// Step 29: Create the main todo app page
export default function Home() {
  return (
    <TodoProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          {/* Step 30: App header */}
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Todo App
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Stay organized and get things done
            </p>
          </header>

          {/* Step 31: Main todo app content */}
          <main className="max-w-4xl mx-auto">
            <TodoInput />
            <TodoList />
          </main>

          {/* Step 32: Footer */}
          <footer className="text-center mt-12 text-gray-500 dark:text-gray-400">
            <p>Built with Next.js, TypeScript, and Tailwind CSS</p>
          </footer>
        </div>
      </div>
    </TodoProvider>
  );
}
