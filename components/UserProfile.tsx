'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Settings, Calendar } from 'lucide-react';

// Step 39: Create user profile component
export default function UserProfile() {
  const { state, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!state.user) return null;

  // Step 40: Format user creation date
  const formatDate = (date: Date | string) => {
    try {
      // Handle both Date objects and date strings
      const dateObj = date instanceof Date ? date : new Date(date);
      
      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        return 'Unknown date';
      }
      
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(dateObj);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown date';
    }
  };

  return (
    <div className="relative">
      {/* Step 41: User avatar and name */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
          {state.user.name.charAt(0).toUpperCase()}
        </div>
        <div className="text-left hidden sm:block">
          <p className="font-medium text-gray-900 dark:text-white">
            {state.user.name}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {state.user.email}
          </p>
        </div>
      </button>

      {/* Step 42: Dropdown menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
          {/* Step 43: User info section */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <p className="font-medium text-gray-900 dark:text-white">
              {state.user.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {state.user.email}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <Calendar size={12} />
              <span>Joined {formatDate(state.user.createdAt)}</span>
            </div>
          </div>

          {/* Step 44: Menu items */}
          <div className="py-2">
            <button className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3">
              <Settings size={16} />
              Settings
            </button>
            
            <button
              onClick={() => {
                logout();
                setIsDropdownOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Step 45: Overlay to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
}