import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Todo from '@/models/Todo';
import { jwtVerify } from 'jose';
import { z } from 'zod';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

const createTodoSchema = z.object({
  text: z.string().min(1, 'Todo text is required').max(500, 'Todo text cannot be more than 500 characters'),
  priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
  dueDate: z.string().datetime().optional(),
});

// GET /api/todos - Get all todos for authenticated user
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    // Verify JWT token
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    // Build query
    const query: any = { user: userId };
    if (status && status !== 'all') {
      query.status = status;
    }
    if (priority) {
      query.priority = priority;
    }

    // Get todos
    const todos = await Todo.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ todos });
  } catch (error) {
    console.error('Get todos error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/todos - Create a new todo
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    // Verify JWT token
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;

    const body = await request.json();
    const { text, priority, dueDate } = createTodoSchema.parse(body);

    // Create new todo
    const todo = new Todo({
      text,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      user: userId,
    });

    await todo.save();

    return NextResponse.json({ todo }, { status: 201 });
  } catch (error) {
    console.error('Create todo error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
