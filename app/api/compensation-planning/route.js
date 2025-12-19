import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/compensation-planning:
 *   get:
 *     summary: Get all compensation planning records
 *     description: Retrieve all compensation planning and salary review records with optional filtering
 *     tags: [Compensation Planning]
 *     parameters:
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by department
 *       - in: query
 *         name: approval_status
 *         schema:
 *           type: string
 *         description: Filter by approval status
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
 *         description: Successfully retrieved compensation planning records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 total:
 *                   type: integer
 *       500:
 *         description: Server error
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const approval_status = searchParams.get('approval_status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let sql = 'SELECT * FROM compensation_planning WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (department) {
      sql += ` AND department = $${paramIndex}`;
      params.push(department);
      paramIndex++;
    }

    if (approval_status) {
      sql += ` AND approval_status = $${paramIndex}`;
      params.push(approval_status);
      paramIndex++;
    }

    sql += ` ORDER BY review_date DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await query(sql, params);
    
    const countResult = await query('SELECT COUNT(*) as total FROM compensation_planning WHERE 1=1' + 
      (department ? ' AND department = $1' : '') + 
      (approval_status ? ` AND approval_status = $${department ? 2 : 1}` : ''),
      params.filter((_, i) => i < paramIndex - 2)
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
      total: parseInt(countResult.rows[0].total)
    });
  } catch (error) {
    console.error('Error fetching compensation planning records:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/compensation-planning:
 *   post:
 *     summary: Create a new compensation planning record
 *     description: Create a new compensation planning and salary review record
 *     tags: [Compensation Planning]
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
 *               - current_salary
 *               - proposed_increase
 *               - review_date
 *               - approval_status
 *               - decision_maker
 *               - effective_date
 *             properties:
 *               employee_name:
 *                 type: string
 *               employee_id:
 *                 type: string
 *               department:
 *                 type: string
 *               current_salary:
 *                 type: integer
 *               proposed_increase:
 *                 type: integer
 *               review_date:
 *                 type: string
 *                 format: date-time
 *               approval_status:
 *                 type: string
 *               remarks:
 *                 type: string
 *               decision_maker:
 *                 type: string
 *               effective_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Compensation planning record created successfully
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
      current_salary,
      proposed_increase,
      review_date,
      approval_status,
      remarks,
      decision_maker,
      effective_date
    } = body;

    // Validation
    if (!employee_name || !employee_id || !department || !current_salary || 
        !proposed_increase || !review_date || !approval_status || !decision_maker || !effective_date) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO compensation_planning 
       (employee_name, employee_id, department, current_salary, proposed_increase, 
        review_date, approval_status, remarks, decision_maker, effective_date) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING *`,
      [employee_name, employee_id, department, current_salary, proposed_increase, 
       review_date, approval_status, remarks, decision_maker, effective_date]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating compensation planning record:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}