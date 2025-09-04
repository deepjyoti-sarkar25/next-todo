'use client';

import React from 'react';
import { useTodos } from '@/contexts/TodoContext';
import { FilterType } from '@/types/todo';
import TodoItem from './TodoItem';
import { ListTodo, CheckCircle, Circle } from 'lucide-react';

// Step 21: Create a component that displays the list of todos with filtering
export default function TodoList() {
  const { state, dispatch } = useTodos();

  // Step 22: Filter todos based on the current filter
  const filteredTodos = state.todos.filter(todo => {
    switch (state.filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true; // 'all'
    }
  });

  // Step 23: Calculate statistics
  const totalTodos = state.todos.length;
  const completedTodos = state.todos.filter(todo => todo.completed).length;
  const activeTodos = totalTodos - completedTodos;

  // Step 24: Handle filter changes
  const handleFilterChange = (filter: FilterType) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  // Step 25: Filter button component
  const FilterButton = ({ filter, label, icon: Icon, count }: {
    filter: FilterType;
    label: string;
    icon: React.ComponentType<{ size: number }>;
    count: number;
  }) => (
    <button
      onClick={() => handleFilterChange(filter)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        state.filter === filter
          ? 'bg-blue-500 text-white'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
      <span className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 rounded-full">
        {count}
      </span>
    </button>
  );

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Step 26: Statistics and filter buttons */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ListTodo size={24} />
            My Todos
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {completedTodos} of {totalTodos} completed
          </div>
        </div>

        {/* Step 27: Filter buttons */}
        <div className="flex gap-2 flex-wrap">
          <FilterButton
            filter="all"
            label="All"
            icon={ListTodo}
            count={totalTodos}
          />
          <FilterButton
            filter="active"
            label="Active"
            icon={Circle}
            count={activeTodos}
          />
          <FilterButton
            filter="completed"
            label="Completed"
            icon={CheckCircle}
            count={completedTodos}
          />
        </div>
      </div>

      {/* Step 28: Todo list */}
      <div className="space-y-3">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            {state.filter === 'all' && totalTodos === 0 && (
              <div>
                <ListTodo size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg">No todos yet!</p>
                <p className="text-sm">Add your first todo above to get started.</p>
              </div>
            )}
            {state.filter === 'active' && activeTodos === 0 && (
              <div>
                <Circle size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg">No active todos!</p>
                <p className="text-sm">All your todos are completed. Great job!</p>
              </div>
            )}
            {state.filter === 'completed' && completedTodos === 0 && (
              <div>
                <CheckCircle size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg">No completed todos!</p>
                <p className="text-sm">Complete some todos to see them here.</p>
              </div>
            )}
          </div>
        ) : (
          filteredTodos.map(todo => (
            <TodoItem key={todo.id} todo={todo} />
          ))
        )}
      </div>
    </div>
  );
}
