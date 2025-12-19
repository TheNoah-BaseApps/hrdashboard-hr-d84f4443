import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/recruitment-ats:
 *   get:
 *     summary: Get all recruitment applicants
 *     description: Retrieve all recruitment applicants with pagination and filtering
 *     tags: [Recruitment ATS]
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
 *         name: position_title
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
    const position_title = searchParams.get('position_title');

    let sql = 'SELECT * FROM recruitment_ats WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (position_title) {
      sql += ` AND position_title = $${paramCount}`;
      params.push(position_title);
      paramCount++;
    }

    sql += ` ORDER BY date_applied DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await query(sql, params);
    
    return NextResponse.json({ 
      success: true, 
      data: result.rows 
    });
  } catch (error) {
    console.error('Error fetching recruitment applicants:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/recruitment-ats:
 *   post:
 *     summary: Create new recruitment applicant
 *     tags: [Recruitment ATS]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - applicant_name
 *               - phone_number
 *               - position_title
 *               - date_applied
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
      applicant_name,
      phone_number,
      position_title,
      date_applied,
      experience,
      question1,
      answer1,
      question2,
      answer2,
      question3,
      answer3,
      question4,
      answer4,
      question5,
      answer5
    } = body;

    // Validation
    if (!applicant_name || !phone_number || !position_title || !date_applied) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO recruitment_ats 
       (applicant_name, phone_number, position_title, date_applied, experience, question1, answer1, question2, answer2, question3, answer3, question4, answer4, question5, answer5, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW()) 
       RETURNING *`,
      [applicant_name, phone_number, position_title, date_applied, experience, question1, answer1, question2, answer2, question3, answer3, question4, answer4, question5, answer5]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating recruitment applicant:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}