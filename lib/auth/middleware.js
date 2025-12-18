import { cookies } from 'next/headers';
import { verifyToken } from './jwt';
import { query } from '@/lib/database/aurora';

export async function verifyAuth(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return { authenticated: false, user: null };
    }

    const { valid, payload } = await verifyToken(token);

    if (!valid) {
      return { authenticated: false, user: null };
    }

    // Get user from database
    const result = await query(
      'SELECT id, email, full_name, role, department FROM users WHERE id = $1',
      [payload.userId]
    );

    if (result.rows.length === 0) {
      return { authenticated: false, user: null };
    }

    return {
      authenticated: true,
      user: result.rows[0]
    };
  } catch (error) {
    console.error('Verify auth error:', error);
    return { authenticated: false, user: null };
  }
}

export async function requireAuth(request) {
  const authResult = await verifyAuth(request);
  
  if (!authResult.authenticated) {
    throw new Error('Unauthorized');
  }

  return authResult;
}