import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';
import { verifyAuth } from '@/lib/auth/middleware';
import { validateOnboarding } from '@/lib/validation/employee-onboarding';
import { createAuditLog } from '@/lib/utils/audit';

/**
 * @swagger
 * /api/employee-onboarding/{id}:
 *   get:
 *     summary: Retrieve single onboarding task
 *     tags: [Employee Onboarding]
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
      'SELECT * FROM employee_onboarding WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Onboarding task not found' },
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
    console.error('Get onboarding task error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch onboarding task' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/employee-onboarding/{id}:
 *   put:
 *     summary: Update onboarding task
 *     tags: [Employee Onboarding]
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
      `UPDATE employee_onboarding 
       SET task = $1, type = $2, document_name = $3, assigned_to = $4,
           name_of_employee = $5, due_date = $6, status = $7, 
           completed_date = $8, updated_at = NOW()
       WHERE id = $9
       RETURNING *`,
      [task, type, document_name, assigned_to, name_of_employee,
       due_date, status, completed_date || null, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Onboarding task not found' },
        { status: 404 }
      );
    }

    await createAuditLog({
      workflow_name: 'employee_onboarding',
      record_id: id,
      action: 'UPDATE',
      user_id: authResult.user.id,
      changes: result.rows[0]
    });

    return NextResponse.json(
      {
        success: true,
        data: result.rows[0],
        message: 'Onboarding task updated successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update onboarding task error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update onboarding task' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/employee-onboarding/{id}:
 *   delete:
 *     summary: Remove onboarding task
 *     tags: [Employee Onboarding]
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
      'DELETE FROM employee_onboarding WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Onboarding task not found' },
        { status: 404 }
      );
    }

    await createAuditLog({
      workflow_name: 'employee_onboarding',
      record_id: id,
      action: 'DELETE',
      user_id: authResult.user.id,
      changes: { id }
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Onboarding task deleted successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete onboarding task error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete onboarding task' },
      { status: 500 }
    );
  }
}