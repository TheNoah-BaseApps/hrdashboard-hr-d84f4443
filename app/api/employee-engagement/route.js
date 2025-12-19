import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/employee-engagement:
 *   get:
 *     summary: Get all employee engagement activities
 *     description: Retrieve all employee engagement activities and feedback with optional filtering
 *     tags: [Employee Engagement]
 *     parameters:
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by department
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *       - in: query
 *         name: employee_id
 *         schema:
 *           type: string
 *         description: Filter by employee ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of records to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of records to skip
 *     responses:
 *       200:
 *         description: Successfully retrieved engagement activities
 *       500:
 *         description: Server error
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const status = searchParams.get('status');
    const employee_id = searchParams.get('employee_id');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let sql = 'SELECT * FROM employee_engagement WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (department) {
      sql += ` AND department = $${paramIndex}`;
      params.push(department);
      paramIndex++;
    }

    if (status) {
      sql += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (employee_id) {
      sql += ` AND employee_id = $${paramIndex}`;
      params.push(employee_id);
      paramIndex++;
    }

    sql += ` ORDER BY date_of_activity DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await query(sql, params);
    
    const countResult = await query('SELECT COUNT(*) as total FROM employee_engagement WHERE 1=1' + 
      (department ? ' AND department = $1' : '') + 
      (status ? ` AND status = $${department ? 2 : 1}` : '') +
      (employee_id ? ` AND employee_id = $${department && status ? 3 : department || status ? 2 : 1}` : ''),
      params.filter((_, i) => i < paramIndex - 2)
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
      total: parseInt(countResult.rows[0].total)
    });
  } catch (error) {
    console.error('Error fetching employee engagement activities:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/employee-engagement:
 *   post:
 *     summary: Create a new employee engagement activity
 *     description: Create a new employee engagement activity and feedback record
 *     tags: [Employee Engagement]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employee_name
 *               - employee_id
 *               - department
 *               - engagement_activity
 *               - date_of_activity
 *               - organizer
 *               - status
 *             properties:
 *               employee_name:
 *                 type: string
 *               employee_id:
 *                 type: string
 *               department:
 *                 type: string
 *               engagement_activity:
 *                 type: string
 *               date_of_activity:
 *                 type: string
 *                 format: date-time
 *               feedback:
 *                 type: string
 *               satisfaction_score:
 *                 type: integer
 *               suggestions:
 *                 type: string
 *               organizer:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Engagement activity created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      employee_name,
      employee_id,
      department,
      engagement_activity,
      date_of_activity,
      feedback,
      satisfaction_score,
      suggestions,
      organizer,
      status
    } = body;

    // Validation
    if (!employee_name || !employee_id || !department || !engagement_activity || 
        !date_of_activity || !organizer || !status) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO employee_engagement 
       (employee_name, employee_id, department, engagement_activity, date_of_activity,
        feedback, satisfaction_score, suggestions, organizer, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING *`,
      [employee_name, employee_id, department, engagement_activity, date_of_activity,
       feedback, satisfaction_score, suggestions, organizer, status]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating employee engagement activity:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}