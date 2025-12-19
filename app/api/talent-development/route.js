import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/talent-development:
 *   get:
 *     summary: Get all talent development programs
 *     description: Retrieve all talent development programs with pagination and filtering
 *     tags: [Talent Development]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: completion_status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Server error
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const completion_status = searchParams.get('completion_status');

    let sql = 'SELECT * FROM talent_development WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (completion_status) {
      sql += ` AND completion_status = $${paramCount}`;
      params.push(completion_status);
      paramCount++;
    }

    sql += ` ORDER BY program_start_date DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await query(sql, params);
    
    return NextResponse.json({ 
      success: true, 
      data: result.rows 
    });
  } catch (error) {
    console.error('Error fetching talent development programs:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/talent-development:
 *   post:
 *     summary: Create new talent development program
 *     tags: [Talent Development]
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
 *               - training_program
 *               - program_start_date
 *               - program_end_date
 *               - progress_percentage
 *               - trainer_name
 *               - completion_status
 *     responses:
 *       201:
 *         description: Successfully created
 *       400:
 *         description: Bad request
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
      training_program,
      program_start_date,
      program_end_date,
      progress_percentage,
      trainer_name,
      completion_status,
      remarks
    } = body;

    // Validation
    if (!employee_name || !employee_id || !department || !training_program || !program_start_date || !program_end_date || !trainer_name || !completion_status) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO talent_development 
       (employee_name, employee_id, department, training_program, program_start_date, program_end_date, progress_percentage, trainer_name, completion_status, remarks, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()) 
       RETURNING *`,
      [employee_name, employee_id, department, training_program, program_start_date, program_end_date, progress_percentage, trainer_name, completion_status, remarks]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating talent development program:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}