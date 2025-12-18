import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';
import { verifyAuth } from '@/lib/auth/middleware';

/**
 * @swagger
 * /api/dashboard/alerts:
 *   get:
 *     summary: Get expiring access and overdue tasks
 *     tags: [Dashboard]
 */
export async function GET(request) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get expiring access (within 7 days)
    const expiringAccess = await query(`
      SELECT id, employee_name, system_access, expiry_date
      FROM access_management
      WHERE status = 'Active'
        AND expiry_date >= CURRENT_DATE
        AND expiry_date <= CURRENT_DATE + INTERVAL '7 days'
      ORDER BY expiry_date ASC
      LIMIT 10
    `);

    // Get overdue tasks
    const overdueTasks = await query(`
      SELECT id, task, name_of_employee, due_date
      FROM employee_onboarding
      WHERE status NOT IN ('Completed', 'Overdue')
        AND due_date < CURRENT_DATE
      ORDER BY due_date ASC
      LIMIT 10
    `);

    return NextResponse.json(
      {
        success: true,
        data: {
          expiringAccess: expiringAccess.rows,
          overdueTasks: overdueTasks.rows
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get dashboard alerts error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard alerts' },
      { status: 500 }
    );
  }
}