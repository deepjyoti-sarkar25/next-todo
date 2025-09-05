// Step 1: Define the structure of our todo items
export interface Todo {
  _id: string;
  text: string;
  completed: boolean;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  user: string;
  createdAt: Date;
  updatedAt: Date;
}

// Step 2: Define the filter types for our todo list
export type FilterType = 'all' | 'active' | 'completed';
