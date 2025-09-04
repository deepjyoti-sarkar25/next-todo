'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

// Step 46: Create protected route wrapper component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { state } = useAuth();
  const router = useRouter();

  // Step 47: Redirect to login if not authenticated
  useEffect(() => {
    if (!state.isLoading && !state.isAuthenticated) {
      router.push('/login');
    }
  }, [state.isAuthenticated, state.isLoading, router]);

  // Step 48: Show loading spinner while checking authentication
  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Step 49: Show nothing while redirecting
  if (!state.isAuthenticated) {
    return null;
  }

  // Step 50: Render protected content
  return <>{children}</>;
}
