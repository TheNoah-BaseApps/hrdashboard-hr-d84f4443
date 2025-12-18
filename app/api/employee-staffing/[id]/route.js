import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';
import { verifyAuth } from '@/lib/auth/middleware';
import { validateStaffing } from '@/lib/validation/employee-staffing';
import { createAuditLog } from '@/lib/utils/audit';

/**
 * @swagger
 * /api/employee-staffing/{id}:
 *   get:
 *     summary: Retrieve single staffing plan
 *     tags: [Employee Staffing]
 */
export async function GET(request, { params }) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const result = await query(
      'SELECT * FROM employee_staffing WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Staffing plan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result.rows[0]
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get staffing plan error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch staffing plan' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/employee-staffing/{id}:
 *   put:
 *     summary: Update staffing plan
 *     tags: [Employee Staffing]
 */
export async function PUT(request, { params }) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
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
      `UPDATE employee_staffing 
       SET recruiting_source_budget = $1, hire_goal = $2, funded = $3,
           status = $4, assigned_to = $5, comments = $6, updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [recruiting_source_budget, hire_goal, funded, status,
       assigned_to, comments || null, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Staffing plan not found' },
        { status: 404 }
      );
    }

    await createAuditLog({
      workflow_name: 'employee_staffing',
      record_id: id,
      action: 'UPDATE',
      user_id: authResult.user.id,
      changes: result.rows[0]
    });

    return NextResponse.json(
      {
        success: true,
        data: result.rows[0],
        message: 'Staffing plan updated successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update staffing plan error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update staffing plan' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/employee-staffing/{id}:
 *   delete:
 *     summary: Remove staffing plan
 *     tags: [Employee Staffing]
 */
export async function DELETE(request, { params }) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    const result = await query(
      'DELETE FROM employee_staffing WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Staffing plan not found' },
        { status: 404 }
      );
    }

    await createAuditLog({
      workflow_name: 'employee_staffing',
      record_id: id,
      action: 'DELETE',
      user_id: authResult.user.id,
      changes: { id }
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Staffing plan deleted successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete staffing plan error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete staffing plan' },
      { status: 500 }
    );
  }
}