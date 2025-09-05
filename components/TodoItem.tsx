'use client';

import React, { useState } from 'react';
import { useTodos } from '@/contexts/TodoContext';
import { Todo } from '@/types/todo';
import { Check, X, Calendar, Edit2, Save, AlertCircle, Clock, Flag } from 'lucide-react';

// Step 14: Create a component for displaying individual todo items
interface TodoItemProps {
  todo: Todo;
}

export default function TodoItem({ todo }: TodoItemProps) {
  const { updateTodo, deleteTodo, state } = useTodos();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editPriority, setEditPriority] = useState(todo.priority);
  const [editStatus, setEditStatus] = useState(todo.status);

  // Step 15: Handle toggling todo completion
  const handleToggle = async () => {
    try {
      await updateTodo(todo._id, { completed: !todo.completed });
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  // Step 16: Handle deleting a todo
  const handleDelete = async () => {
    try {
      await deleteTodo(todo._id);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // Handle editing
  const handleEdit = () => {
    setIsEditing(true);
    setEditText(todo.text);
    setEditPriority(todo.priority);
    setEditStatus(todo.status);
  };

  const handleSave = async () => {
    try {
      await updateTodo(todo._id, {
        text: editText,
        priority: editPriority,
        status: editStatus,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(todo.text);
    setEditPriority(todo.priority);
    setEditStatus(todo.status);
  };

  // Step 17: Format the creation date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  // Priority color mapping
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'in-progress': return 'text-blue-500';
      case 'cancelled': return 'text-red-500';
      case 'pending': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  if (isEditing) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="space-y-3">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            disabled={state.isLoading}
          />
          
          <div className="flex gap-2">
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={state.isLoading}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as 'pending' | 'in-progress' | 'completed' | 'cancelled')}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={state.isLoading}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={state.isLoading || !editText.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save size={16} />
              {state.isLoading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              disabled={state.isLoading}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`group flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 ${
      todo.completed ? 'opacity-75' : ''
    }`}>
      {/* Step 18: Checkbox for toggling completion */}
      <button
        onClick={handleToggle}
        disabled={state.isLoading}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors disabled:opacity-50 ${
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
        <div className="flex items-center gap-2 mb-1">
          <p className={`text-gray-900 dark:text-white ${
            todo.completed ? 'line-through text-gray-500' : ''
          }`}>
            {todo.text}
          </p>
          <div className="flex items-center gap-1">
            <Flag size={12} className={getPriorityColor(todo.priority)} />
            <span className={`text-xs ${getPriorityColor(todo.priority)}`}>
              {todo.priority}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{formatDate(todo.createdAt)}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Clock size={12} className={getStatusColor(todo.status)} />
            <span className={getStatusColor(todo.status)}>
              {todo.status.replace('-', ' ')}
            </span>
          </div>
          
          {todo.dueDate && (
            <div className="flex items-center gap-1">
              <AlertCircle size={12} className="text-orange-500" />
              <span className="text-orange-500">
                Due: {formatDate(todo.dueDate)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleEdit}
          disabled={state.isLoading}
          className="p-1 text-gray-400 hover:text-blue-500 transition-colors disabled:opacity-50"
          aria-label="Edit todo"
        >
          <Edit2 size={18} />
        </button>
        <button
          onClick={handleDelete}
          disabled={state.isLoading}
          className="p-1 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
          aria-label="Delete todo"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
