'use client';

import React from 'react';
import { useTodos } from '@/contexts/TodoContext';
import { Todo } from '@/types/todo';
import { Check, X, Calendar } from 'lucide-react';

// Step 14: Create a component for displaying individual todo items
interface TodoItemProps {
  todo: Todo;
}

export default function TodoItem({ todo }: TodoItemProps) {
  const { dispatch } = useTodos();

  // Step 15: Handle toggling todo completion
  const handleToggle = () => {
    dispatch({ type: 'TOGGLE_TODO', payload: todo.id });
  };

  // Step 16: Handle deleting a todo
  const handleDelete = () => {
    dispatch({ type: 'DELETE_TODO', payload: todo.id });
  };

  // Step 17: Format the creation date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className={`group flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 ${
      todo.completed ? 'opacity-75' : ''
    }`}>
      {/* Step 18: Checkbox for toggling completion */}
      <button
        onClick={handleToggle}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          todo.completed
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-300 hover:border-green-400'
        }`}
        aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {todo.completed && <Check size={16} />}
      </button>

      {/* Step 19: Todo text content */}
      <div className="flex-1 min-w-0">
        <p className={`text-gray-900 dark:text-white ${
          todo.completed ? 'line-through text-gray-500' : ''
        }`}>
          {todo.text}
        </p>
        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
          <Calendar size={12} />
          <span>{formatDate(todo.createdAt)}</span>
        </div>
      </div>

      {/* Step 20: Delete button */}
      <button
        onClick={handleDelete}
        className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Delete todo"
      >
        <X size={18} />
      </button>
    </div>
  );
}
