import mongoose, { Document, Schema } from 'mongoose';

export interface ITodo extends Document {
  text: string;
  completed: boolean;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TodoSchema = new Schema<ITodo>({
  text: {
    type: String,
    required: [true, 'Todo text is required'],
    trim: true,
    maxlength: [500, 'Todo text cannot be more than 500 characters'],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  dueDate: {
    type: Date,
    default: null,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
TodoSchema.index({ user: 1, createdAt: -1 });
TodoSchema.index({ user: 1, status: 1 });
TodoSchema.index({ user: 1, priority: 1 });

export default mongoose.models.Todo || mongoose.model<ITodo>('Todo', TodoSchema);
