'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { Todo, FilterType } from '@/types/todo';

// Step 3: Define the shape of our todo state
interface TodoState {
  todos: Todo[];
  filter: FilterType;
  isLoading: boolean;
}

// Step 4: Define actions that can modify our state
type TodoAction =
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'UPDATE_TODO'; payload: Todo }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'SET_FILTER'; payload: FilterType }
  | { type: 'LOAD_TODOS'; payload: Todo[] }
  | { type: 'SET_LOADING'; payload: boolean };

// Step 5: Create the initial state
const initialState: TodoState = {
  todos: [],
  filter: 'all',
  isLoading: false,
};

// Step 6: Create the reducer function that handles state updates
function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [action.payload, ...state.todos],
        isLoading: false,
      };
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo._id === action.payload._id ? action.payload : todo
        ),
        isLoading: false,
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo._id !== action.payload),
        isLoading: false,
      };
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload,
      };
    case 'LOAD_TODOS':
      return {
        ...state,
        todos: action.payload,
        isLoading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}

// Step 7: Create the context
const TodoContext = createContext<{
  state: TodoState;
  dispatch: React.Dispatch<TodoAction>;
  addTodo: (text: string, priority?: 'low' | 'medium' | 'high', dueDate?: Date) => Promise<void>;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  loadTodos: () => Promise<void>;
} | null>(null);

// Step 8: Create the provider component
export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  // API functions
  const getAuthHeaders = () => {
    const token = localStorage.getItem('auth-token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  };

  const addTodo = async (text: string, priority: 'low' | 'medium' | 'high' = 'medium', dueDate?: Date) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          text,
          priority,
          dueDate: dueDate?.toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create todo');
      }

      const { todo } = await response.json();
      dispatch({ type: 'ADD_TODO', payload: todo });
    } catch (error) {
      console.error('Error adding todo:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update todo');
      }

      const { todo } = await response.json();
      dispatch({ type: 'UPDATE_TODO', payload: todo });
    } catch (error) {
      console.error('Error updating todo:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete todo');
      }

      dispatch({ type: 'DELETE_TODO', payload: id });
    } catch (error) {
      console.error('Error deleting todo:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const loadTodos = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch('/api/todos', {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to load todos');
      }

      const { todos } = await response.json();
      dispatch({ type: 'LOAD_TODOS', payload: todos });
    } catch (error) {
      console.error('Error loading todos:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  }, []);

  // Step 9: Load todos on component mount
  useEffect(() => {
    const userId = localStorage.getItem('user-id');
    if (userId) {
      loadTodos();
    }
  }, [loadTodos]);

  return (
    <TodoContext.Provider value={{ 
      state, 
      dispatch, 
      addTodo, 
      updateTodo, 
      deleteTodo, 
      loadTodos 
    }}>
      {children}
    </TodoContext.Provider>
  );
}

// Step 11: Create a custom hook to use the context
export function useTodos() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
}
