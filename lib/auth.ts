import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import connectDB from './mongodb';
import User from '@/models/User';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

export async function getServerSideUser(request?: NextRequest) {
  try {
    await connectDB();

    let token: string | undefined;

    if (request) {
      // For API routes
      token = request.headers.get('authorization')?.replace('Bearer ', '');
    } else {
      // For server components
      const cookieStore = await cookies();
      token = cookieStore.get('auth-token')?.value;
    }

    if (!token) {
      return null;
    }

    // Verify JWT token
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId;

    console.log('JWT payload userId type:', typeof userId, 'value:', userId);

    // Handle different userId formats
    let userIdString: string;
    if (typeof userId === 'string') {
      userIdString = userId;
    } else if (userId && typeof userId === 'object') {
      // If it's a buffer or object, try to convert it
      if (userId.buffer && Array.isArray(userId.buffer)) {
        // It's a buffer object, convert to ObjectId string
        const buffer = Buffer.from(userId.buffer);
        userIdString = buffer.toString('hex');
        
        // Ensure it's a valid 24-character hex string for ObjectId
        if (userIdString.length !== 24) {
          console.error('Invalid ObjectId length:', userIdString.length, userIdString);
          return null;
        }
      } else {
        // Try to convert to string
        userIdString = String(userId);
        // If it's still an object, it's invalid
        if (userIdString === '[object Object]') {
          console.error('Invalid userId object - this is likely an old JWT token. Please clear your browser data and try again.');
          console.error('JWT payload userId:', JSON.stringify(userId, null, 2));
          
          // Clear the invalid token from cookies
          try {
            await clearAuthCookie();
          } catch (e) {
            console.error('Error clearing auth cookie:', e);
          }
          
          return null;
        }
      }
    } else {
      console.error('Invalid userId type:', typeof userId, userId);
      return null;
    }

    console.log('Converted userId:', userIdString);

    // Find user
    const user = await User.findById(userIdString);
    if (!user) {
      return null;
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
}
