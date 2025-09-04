'use client';

import React, { useState } from 'react';
import { useTodos } from '@/contexts/TodoContext';
import { Plus } from 'lucide-react';

// Step 12: Create a component for adding new todos
export default function TodoInput() {
  const [inputValue, setInputValue] = useState('');
  const { dispatch } = useTodos();

  // Step 13: Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      dispatch({ type: 'ADD_TODO', payload: inputValue.trim() });
      setInputValue(''); // Clear input after adding
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add
        </button>
      </div>
    </form>
  );
}
