import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/employee-helpdesk:
 *   get:
 *     summary: Get all employee helpdesk tickets
 *     description: Retrieve a list of all employee helpdesk tickets with pagination
 *     tags: [Employee Helpdesk]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *         description: Filter by priority
 *     responses:
 *       200:
 *         description: List of helpdesk tickets
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
 *                 pagination:
 *                   type: object
 *       500:
 *         description: Server error
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const offset = (page - 1) * limit;

    let queryText = 'SELECT * FROM employee_helpdesk WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (status) {
      queryText += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (priority) {
      queryText += ` AND priority = $${paramIndex}`;
      params.push(priority);
      paramIndex++;
    }

    queryText += ` ORDER BY date_raised DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    const countResult = await query('SELECT COUNT(*) FROM employee_helpdesk');
    const total = parseInt(countResult.rows[0].count);

    return NextResponse.json({
      success: true,
      data: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching employee helpdesk tickets:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/employee-helpdesk:
 *   post:
 *     summary: Create a new helpdesk ticket
 *     description: Create a new employee helpdesk ticket
 *     tags: [Employee Helpdesk]
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
 *               - issue_type
 *               - description
 *               - date_raised
 *               - status
 *               - priority
 *               - assigned_to
 *             properties:
 *               employee_name:
 *                 type: string
 *               employee_id:
 *                 type: string
 *               department:
 *                 type: string
 *               issue_type:
 *                 type: string
 *               description:
 *                 type: string
 *               date_raised:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *               priority:
 *                 type: string
 *               resolution_date:
 *                 type: string
 *                 format: date-time
 *               assigned_to:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ticket created successfully
 *       400:
 *         description: Invalid input
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
      issue_type,
      description,
      date_raised,
      status,
      priority,
      resolution_date,
      assigned_to
    } = body;

    if (!employee_name || !employee_id || !department || !issue_type || !description || !date_raised || !status || !priority || !assigned_to) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO employee_helpdesk 
       (employee_name, employee_id, department, issue_type, description, date_raised, status, priority, resolution_date, assigned_to, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
       RETURNING *`,
      [employee_name, employee_id, department, issue_type, description, date_raised, status, priority, resolution_date || null, assigned_to]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating helpdesk ticket:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}