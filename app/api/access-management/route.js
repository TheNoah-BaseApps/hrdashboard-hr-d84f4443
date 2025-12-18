import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';
import { verifyAuth } from '@/lib/auth/middleware';
import { validateAccessManagement } from '@/lib/validation/access-management';
import { createAuditLog } from '@/lib/utils/audit';

/**
 * @swagger
 * /api/access-management:
 *   get:
 *     summary: List all access management records with filters
 *     tags: [Access Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of access management records
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
    const department = searchParams.get('department');

    let sql = 'SELECT * FROM access_management WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (status) {
      sql += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (department) {
      sql += ` AND department = $${paramIndex}`;
      params.push(department);
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
    console.error('Get access management records error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch access management records' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/access-management:
 *   post:
 *     summary: Create new access grant record
 *     tags: [Access Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Access record created
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
      `INSERT INTO access_management 
       (employee_name, employee_id, department, access_level, system_access, 
        granted_by, date_granted, expiry_date, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
       RETURNING *`,
      [employee_name, employee_id, department, access_level, system_access,
       granted_by, date_granted, expiry_date, status]
    );

    await createAuditLog({
      workflow_name: 'access_management',
      record_id: result.rows[0].id,
      action: 'CREATE',
      user_id: authResult.user.id,
      changes: result.rows[0]
    });

    return NextResponse.json(
      {
        success: true,
        data: result.rows[0],
        message: 'Access record created successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create access management record error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create access record' },
      { status: 500 }
    );
  }
}