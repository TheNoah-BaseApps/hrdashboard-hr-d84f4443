import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';
import { verifyAuth } from '@/lib/auth/middleware';
import { validateOnboarding } from '@/lib/validation/employee-onboarding';
import { createAuditLog } from '@/lib/utils/audit';

/**
 * @swagger
 * /api/employee-onboarding:
 *   get:
 *     summary: List all onboarding tasks with filters
 *     tags: [Employee Onboarding]
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    let sql = 'SELECT * FROM employee_onboarding WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (status) {
      sql += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (type) {
      sql += ` AND type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    sql += ' ORDER BY created_at DESC';

    const result = await query(sql, params);

    return NextResponse.json(
      {
        success: true,
        data: result.rows
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get onboarding tasks error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch onboarding tasks' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/employee-onboarding:
 *   post:
 *     summary: Create new onboarding task
 *     tags: [Employee Onboarding]
 */
export async function POST(request) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const validation = validateOnboarding(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const {
      task,
      type,
      document_name,
      assigned_to,
      name_of_employee,
      due_date,
      status,
      completed_date
    } = body;

    const result = await query(
      `INSERT INTO employee_onboarding 
       (task, type, document_name, assigned_to, name_of_employee, 
        due_date, status, completed_date, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
       RETURNING *`,
      [task, type, document_name, assigned_to, name_of_employee,
       due_date, status, completed_date || null]
    );

    await createAuditLog({
      workflow_name: 'employee_onboarding',
      record_id: result.rows[0].id,
      action: 'CREATE',
      user_id: authResult.user.id,
      changes: result.rows[0]
    });

    return NextResponse.json(
      {
        success: true,
        data: result.rows[0],
        message: 'Onboarding task created successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create onboarding task error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create onboarding task' },
      { status: 500 }
    );
  }
}