'use client';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/LoginForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Step 31: Create login page content component
function LoginPageContent() {
  const { state } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (state.isAuthenticated && !state.isLoading) {
      router.push('/');
    }
  }, [state.isAuthenticated, state.isLoading, router]);

  // Show loading while checking authentication
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

  // Don't render login form if already authenticated
  if (state.isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Step 32: Back to home link */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
        </div>

        {/* Step 33: Login form */}
        <LoginForm />

        {/* Step 34: Link to register */}
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// Step 31: Create login page
export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginPageContent />
    </AuthProvider>
  );
}