'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { TodoProvider } from '@/contexts/TodoContext';
import TodoInput from '@/components/TodoInput';
import TodoList from '@/components/TodoList';
import UserProfile from '@/components/UserProfile';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { LogIn, UserPlus } from 'lucide-react';

// Step 51: Create the main todo app page with authentication
function TodoApp() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Step 52: App header with user profile */}
        <header className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Todo App
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Stay organized and get things done
            </p>
          </div>
          <UserProfile />
        </header>

        {/* Step 53: Main todo app content */}
        <main className="max-w-4xl mx-auto">
          <TodoInput />
          <TodoList />
        </main>

        {/* Step 54: Footer */}
        <footer className="text-center mt-12 text-gray-500 dark:text-gray-400">
          <p>Built with Next.js, TypeScript, and Tailwind CSS</p>
        </footer>
      </div>
    </div>
  );
}

// Step 55: Create landing page for non-authenticated users
function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Welcome to Todo App
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          Stay organized and get things done with our beautiful todo application
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-blue-500 text-white px-8 py-4 rounded-lg hover:bg-blue-600 transition-colors text-lg font-medium"
          >
            <LogIn size={24} />
            Sign In
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-4 rounded-lg hover:bg-green-600 transition-colors text-lg font-medium"
          >
            <UserPlus size={24} />
            Sign Up
          </Link>
        </div>

        <div className="mt-16 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Demo Credentials
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            You can use these credentials to test the app:
          </p>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <p className="font-mono text-sm">
              Email: demo@example.com<br />
              Password: password
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 57: Auth wrapper component to handle authentication state
function AuthWrapper() {
  const { state } = useAuth();

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (state.isAuthenticated) {
    return (
      <TodoProvider>
        <ProtectedRoute>
          <TodoApp />
        </ProtectedRoute>
      </TodoProvider>
    );
  }

  return <LandingPage />;
}

// Step 56: Main page component with authentication logic
export default function Home() {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
}