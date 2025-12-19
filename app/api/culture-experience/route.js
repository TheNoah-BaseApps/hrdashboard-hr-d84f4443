import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/culture-experience:
 *   get:
 *     summary: Get all culture and experience initiatives
 *     description: Retrieve all culture and employee experience initiatives with optional filtering
 *     tags: [Culture and Experience]
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
 *         description: Successfully retrieved initiatives
 *       500:
 *         description: Server error
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let sql = 'SELECT * FROM culture_experience WHERE 1=1';
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

    sql += ` ORDER BY date_of_initiative DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await query(sql, params);
    
    const countResult = await query('SELECT COUNT(*) as total FROM culture_experience WHERE 1=1' + 
      (department ? ' AND department = $1' : '') + 
      (status ? ` AND status = $${department ? 2 : 1}` : ''),
      params.filter((_, i) => i < paramIndex - 2)
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
      total: parseInt(countResult.rows[0].total)
    });
  } catch (error) {
    console.error('Error fetching culture experience initiatives:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/culture-experience:
 *   post:
 *     summary: Create a new culture and experience initiative
 *     description: Create a new culture and employee experience initiative
 *     tags: [Culture and Experience]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - initiative_name
 *               - team_involved
 *               - date_of_initiative
 *               - department
 *               - status
 *               - contact_person
 *             properties:
 *               initiative_name:
 *                 type: string
 *               team_involved:
 *                 type: string
 *               date_of_initiative:
 *                 type: string
 *                 format: date-time
 *               department:
 *                 type: string
 *               feedback:
 *                 type: string
 *               status:
 *                 type: string
 *               contact_person:
 *                 type: string
 *               action_plan:
 *                 type: string
 *     responses:
 *       201:
 *         description: Initiative created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      initiative_name,
      team_involved,
      date_of_initiative,
      department,
      feedback,
      status,
      contact_person,
      action_plan
    } = body;

    // Validation
    if (!initiative_name || !team_involved || !date_of_initiative || 
        !department || !status || !contact_person) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO culture_experience 
       (initiative_name, team_involved, date_of_initiative, department, 
        feedback, status, contact_person, action_plan) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [initiative_name, team_involved, date_of_initiative, department,
       feedback, status, contact_person, action_plan]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating culture experience initiative:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}