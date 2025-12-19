import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/talent-mapping:
 *   get:
 *     summary: Get all talent mapping entries
 *     description: Retrieve all talent mapping entries with pagination and filtering
 *     tags: [Talent Mapping]
 *     parameters:
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
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by department
 *     responses:
 *       200:
 *         description: Successful response
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
 *       500:
 *         description: Server error
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const department = searchParams.get('department');

    let sql = 'SELECT * FROM talent_mapping WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (department) {
      sql += ` AND department = $${paramCount}`;
      params.push(department);
      paramCount++;
    }

    sql += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await query(sql, params);
    
    return NextResponse.json({ 
      success: true, 
      data: result.rows 
    });
  } catch (error) {
    console.error('Error fetching talent mapping:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/talent-mapping:
 *   post:
 *     summary: Create new talent mapping entry
 *     description: Create a new talent mapping entry
 *     tags: [Talent Mapping]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employee_id
 *               - name_surname
 *               - department
 *               - position
 *               - years_of_experience
 *               - job_level
 *               - age
 *               - performance
 *               - potential
 *               - box_categorization
 *             properties:
 *               employee_id:
 *                 type: string
 *               name_surname:
 *                 type: string
 *               department:
 *                 type: string
 *               position:
 *                 type: string
 *               years_of_experience:
 *                 type: integer
 *               job_level:
 *                 type: string
 *               age:
 *                 type: integer
 *               performance:
 *                 type: string
 *               potential:
 *                 type: string
 *               box_categorization:
 *                 type: string
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
      employee_id,
      name_surname,
      department,
      position,
      years_of_experience,
      job_level,
      age,
      performance,
      potential,
      box_categorization
    } = body;

    // Validation
    if (!employee_id || !name_surname || !department || !position || !job_level || !performance || !potential || !box_categorization) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO talent_mapping 
       (employee_id, name_surname, department, position, years_of_experience, job_level, age, performance, potential, box_categorization, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()) 
       RETURNING *`,
      [employee_id, name_surname, department, position, years_of_experience, job_level, age, performance, potential, box_categorization]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating talent mapping entry:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}