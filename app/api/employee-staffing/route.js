import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';
import { verifyAuth } from '@/lib/auth/middleware';
import { validateStaffing } from '@/lib/validation/employee-staffing';
import { createAuditLog } from '@/lib/utils/audit';

/**
 * @swagger
 * /api/employee-staffing:
 *   get:
 *     summary: List all staffing plans with filters
 *     tags: [Employee Staffing]
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
    const funded = searchParams.get('funded');

    let sql = 'SELECT * FROM employee_staffing WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (status) {
      sql += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (funded !== null && funded !== undefined) {
      sql += ` AND funded = $${paramIndex}`;
      params.push(funded === 'true');
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
    console.error('Get staffing plans error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch staffing plans' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/employee-staffing:
 *   post:
 *     summary: Create new staffing plan
 *     tags: [Employee Staffing]
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

    const validation = validateStaffing(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const {
      recruiting_source_budget,
      hire_goal,
      funded,
      status,
      assigned_to,
      comments
    } = body;

    const result = await query(
      `INSERT INTO employee_staffing 
       (recruiting_source_budget, hire_goal, funded, status, 
        assigned_to, comments, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING *`,
      [recruiting_source_budget, hire_goal, funded || false, status,
       assigned_to, comments || null]
    );

    await createAuditLog({
      workflow_name: 'employee_staffing',
      record_id: result.rows[0].id,
      action: 'CREATE',
      user_id: authResult.user.id,
      changes: result.rows[0]
    });

    return NextResponse.json(
      {
        success: true,
        data: result.rows[0],
        message: 'Staffing plan created successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create staffing plan error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create staffing plan' },
      { status: 500 }
    );
  }
}