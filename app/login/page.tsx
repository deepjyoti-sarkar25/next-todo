import { redirect } from 'next/navigation';
import { getServerSideUser } from '@/lib/auth';
import LoginForm from '@/components/LoginForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function LoginPage() {
  // Check if user is already authenticated
  const user = await getServerSideUser();
  
  if (user) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back to home link */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
        </div>

        {/* Login form */}
        <LoginForm />

        {/* Link to register */}
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{' '}
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