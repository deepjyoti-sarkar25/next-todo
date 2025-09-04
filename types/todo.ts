// Step 1: Define the structure of our todo items
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

// Step 2: Define the filter types for our todo list
export type FilterType = 'all' | 'active' | 'completed';
