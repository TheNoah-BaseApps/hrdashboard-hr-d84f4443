import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/employee-rewards:
 *   get:
 *     summary: Get all employee rewards
 *     description: Retrieve a list of all employee rewards and benefits with pagination
 *     tags: [Employee Rewards]
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
 *         name: benefit_type
 *         schema:
 *           type: string
 *         description: Filter by benefit type
 *     responses:
 *       200:
 *         description: List of rewards
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
    const benefit_type = searchParams.get('benefit_type');
    const offset = (page - 1) * limit;

    let queryText = 'SELECT * FROM employee_rewards WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (benefit_type) {
      queryText += ` AND benefit_type = $${paramIndex}`;
      params.push(benefit_type);
      paramIndex++;
    }

    queryText += ` ORDER BY date DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    const countResult = await query('SELECT COUNT(*) FROM employee_rewards');
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
    console.error('Error fetching employee rewards:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/employee-rewards:
 *   post:
 *     summary: Create a new employee reward
 *     description: Create a new employee reward or benefit plan
 *     tags: [Employee Rewards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - benefit_type
 *               - plan_name
 *               - date
 *               - coverage
 *               - employee_pays
 *               - company_pays
 *               - frequency
 *             properties:
 *               benefit_type:
 *                 type: string
 *               plan_name:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               coverage:
 *                 type: string
 *               employee_pays:
 *                 type: integer
 *               company_pays:
 *                 type: integer
 *               frequency:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reward created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      benefit_type,
      plan_name,
      date,
      coverage,
      employee_pays,
      company_pays,
      frequency
    } = body;

    if (!benefit_type || !plan_name || !date || !coverage || employee_pays === undefined || company_pays === undefined || !frequency) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO employee_rewards 
       (benefit_type, plan_name, date, coverage, employee_pays, company_pays, frequency, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING *`,
      [benefit_type, plan_name, date, coverage, employee_pays, company_pays, frequency]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating employee reward:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}