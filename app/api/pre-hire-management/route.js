import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/pre-hire-management:
 *   get:
 *     summary: Get all pre hire candidates
 *     description: Retrieve all pre hire candidates with pagination and filtering
 *     tags: [Pre Hire Management]
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
 *         name: interview_status
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
    const interview_status = searchParams.get('interview_status');

    let sql = 'SELECT * FROM pre_hire_management WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (interview_status) {
      sql += ` AND interview_status = $${paramCount}`;
      params.push(interview_status);
      paramCount++;
    }

    sql += ` ORDER BY application_date DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await query(sql, params);
    
    return NextResponse.json({ 
      success: true, 
      data: result.rows 
    });
  } catch (error) {
    console.error('Error fetching pre hire candidates:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/pre-hire-management:
 *   post:
 *     summary: Create new pre hire candidate
 *     tags: [Pre Hire Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pre_hire_id
 *               - candidate_name
 *               - position_applied_for
 *               - department
 *               - application_date
 *               - interview_status
 *               - background_check_status
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
      pre_hire_id,
      candidate_name,
      position_applied_for,
      department,
      application_date,
      resume_link,
      interview_scheduled_date,
      interviewer_name,
      interview_status,
      background_check_status,
      offer_letter_date,
      offer_acceptance_date,
      expected_joining_date,
      remarks
    } = body;

    // Validation
    if (!pre_hire_id || !candidate_name || !position_applied_for || !department || !application_date || !interview_status || !background_check_status) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO pre_hire_management 
       (pre_hire_id, candidate_name, position_applied_for, department, application_date, resume_link, interview_scheduled_date, interviewer_name, interview_status, background_check_status, offer_letter_date, offer_acceptance_date, expected_joining_date, remarks, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW()) 
       RETURNING *`,
      [pre_hire_id, candidate_name, position_applied_for, department, application_date, resume_link, interview_scheduled_date, interviewer_name, interview_status, background_check_status, offer_letter_date, offer_acceptance_date, expected_joining_date, remarks]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating pre hire candidate:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}