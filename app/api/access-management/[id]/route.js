import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';
import { verifyAuth } from '@/lib/auth/middleware';
import { validateAccessManagement } from '@/lib/validation/access-management';
import { createAuditLog } from '@/lib/utils/audit';

/**
 * @swagger
 * /api/access-management/{id}:
 *   get:
 *     summary: Retrieve single access record
 *     tags: [Access Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
      'SELECT * FROM access_management WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Access record not found' },
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
    console.error('Get access record error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch access record' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/access-management/{id}:
 *   put:
 *     summary: Update access record
 *     tags: [Access Management]
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

    const validation = validateAccessManagement(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const {
      employee_name,
      employee_id,
      department,
      access_level,
      system_access,
      granted_by,
      date_granted,
      expiry_date,
      status
    } = body;

    const result = await query(
      `UPDATE access_management 
       SET employee_name = $1, employee_id = $2, department = $3, 
           access_level = $4, system_access = $5, granted_by = $6,
           date_granted = $7, expiry_date = $8, status = $9, updated_at = NOW()
       WHERE id = $10
       RETURNING *`,
      [employee_name, employee_id, department, access_level, system_access,
       granted_by, date_granted, expiry_date, status, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Access record not found' },
        { status: 404 }
      );
    }

    await createAuditLog({
      workflow_name: 'access_management',
      record_id: id,
      action: 'UPDATE',
      user_id: authResult.user.id,
      changes: result.rows[0]
    });

    return NextResponse.json(
      {
        success: true,
        data: result.rows[0],
        message: 'Access record updated successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update access record error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update access record' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/access-management/{id}:
 *   delete:
 *     summary: Remove access record
 *     tags: [Access Management]
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
      'DELETE FROM access_management WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Access record not found' },
        { status: 404 }
      );
    }

    await createAuditLog({
      workflow_name: 'access_management',
      record_id: id,
      action: 'DELETE',
      user_id: authResult.user.id,
      changes: { id }
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Access record deleted successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete access record error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete access record' },
      { status: 500 }
    );
  }
}