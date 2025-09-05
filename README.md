# Todo App with SSR and MongoDB

A modern, full-stack todo application built with Next.js 15, TypeScript, MongoDB, and Tailwind CSS. Features server-side rendering (SSR), user authentication, and a comprehensive todo management system with priority levels, status tracking, and due dates.

## Features

- 🔐 **User Authentication** - Secure login/register with JWT tokens
- 📝 **Todo Management** - Create, edit, delete, and organize todos
- 🎯 **Priority Levels** - Low, Medium, High priority classification
- 📊 **Status Tracking** - Pending, In Progress, Completed, Cancelled
- 📅 **Due Dates** - Set and track todo deadlines
- 🌙 **Dark Mode** - Beautiful dark/light theme support
- ⚡ **SSR** - Server-side rendering for better SEO and performance
- 🗄️ **MongoDB** - Persistent data storage with Mongoose
- 📱 **Responsive** - Mobile-first responsive design

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Authentication**: JWT tokens, bcryptjs for password hashing
- **Icons**: Lucide React
- **Validation**: Zod for schema validation

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ 
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/todo-app
   
   # JWT Secret (generate a strong secret for production)
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # Next.js Environment
   NODE_ENV=development
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system:
   ```bash
   # For local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI in .env.local with your Atlas connection string
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
my-app/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── register/route.ts
│   │   │   └── me/route.ts
│   │   └── todos/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── page.tsx
├── components/
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   ├── TodoInput.tsx
│   ├── TodoItem.tsx
│   ├── TodoList.tsx
│   ├── UserProfile.tsx
│   └── ProtectedRoute.tsx
├── contexts/
│   ├── AuthContext.tsx
│   └── TodoContext.tsx
├── lib/
│   ├── auth.ts
│   ├── mongodb.ts
│   └── global.d.ts
├── models/
│   ├── User.ts
│   └── Todo.ts
├── types/
│   ├── auth.ts
│   └── todo.ts
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Todos
- `GET /api/todos` - Get all todos for authenticated user
- `POST /api/todos` - Create a new todo
- `GET /api/todos/[id]` - Get a specific todo
- `PUT /api/todos/[id]` - Update a todo
- `DELETE /api/todos/[id]` - Delete a todo

## Database Schema

### User Schema
```typescript
{
  name: string;
  email: string (unique);
  password: string (hashed);
  createdAt: Date;
  updatedAt: Date;
}
```

### Todo Schema
```typescript
{
  text: string;
  completed: boolean;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  user: ObjectId (reference to User);
  createdAt: Date;
  updatedAt: Date;
}
```

## Usage

1. **Register a new account** or **login** with existing credentials
2. **Create todos** by typing in the input field and selecting priority/due date
3. **Edit todos** by clicking the edit icon and modifying details
4. **Toggle completion** by clicking the checkbox
5. **Filter todos** using the All/Active/Completed buttons
6. **Delete todos** by clicking the delete icon

## Features in Detail

### Authentication
- Secure password hashing with bcryptjs
- JWT token-based authentication
- Server-side authentication verification
- Automatic token refresh

### Todo Management
- Rich todo creation with priority and due date
- Inline editing capabilities
- Status tracking with visual indicators
- Priority-based color coding
- Due date notifications

### UI/UX
- Modern, clean design with Tailwind CSS
- Dark mode support
- Responsive mobile-first design
- Loading states and error handling
- Smooth animations and transitions

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features
1. Create API routes in `app/api/`
2. Update types in `types/`
3. Add components in `components/`
4. Update contexts for state management

## Deployment

### Environment Variables for Production
```env
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
NODE_ENV=production
```

### Deploy to Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
