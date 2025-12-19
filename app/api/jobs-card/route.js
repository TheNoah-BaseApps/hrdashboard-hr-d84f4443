import { NextResponse } from 'next/server';
import { query, getClient } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/jobs-card:
 *   get:
 *     summary: Get all jobs cards
 *     description: Retrieve all employee job information cards with pagination
 *     tags: [Jobs Card]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
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
 *         description: Successfully retrieved jobs cards
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
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    const department = searchParams.get('department');

    let queryText = 'SELECT * FROM jobs_card';
    let params = [];
    let paramCount = 0;

    if (department) {
      queryText += ' WHERE department = $' + (++paramCount);
      params.push(department);
    }

    queryText += ' ORDER BY created_at DESC LIMIT $' + (++paramCount) + ' OFFSET $' + (++paramCount);
    params.push(limit, offset);

    const result = await query(queryText, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching jobs cards:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/jobs-card:
 *   post:
 *     summary: Create a new jobs card
 *     description: Create a new employee job information card
 *     tags: [Jobs Card]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - employment_status
 *               - aca_full_time
 *               - employee_name
 *               - location
 *               - department
 *               - job_title
 *               - reports_to
 *               - pay_rate
 *               - pay_type
 *               - pay_schedule
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *               employment_status:
 *                 type: string
 *               aca_full_time:
 *                 type: boolean
 *               employee_name:
 *                 type: string
 *               note:
 *                 type: string
 *               location:
 *                 type: string
 *               department:
 *                 type: string
 *               job_title:
 *                 type: string
 *               reports_to:
 *                 type: string
 *               pay_rate:
 *                 type: integer
 *               pay_type:
 *                 type: string
 *               pay_schedule:
 *                 type: string
 *               bonus_amount:
 *                 type: integer
 *               bonus_date:
 *                 type: string
 *                 format: date-time
 *               bonus_reason:
 *                 type: string
 *               bonus_comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Jobs card created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      date,
      employment_status,
      aca_full_time,
      employee_name,
      note,
      location,
      department,
      job_title,
      reports_to,
      pay_rate,
      pay_type,
      pay_schedule,
      bonus_amount,
      bonus_date,
      bonus_reason,
      bonus_comment
    } = body;

    // Validation
    if (!date || !employment_status || aca_full_time === undefined || !employee_name || !location || !department || !job_title || !reports_to || !pay_rate || !pay_type || !pay_schedule) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO jobs_card (
        date, employment_status, aca_full_time, employee_name, note, location,
        department, job_title, reports_to, pay_rate, pay_type, pay_schedule,
        bonus_amount, bonus_date, bonus_reason, bonus_comment, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW())
      RETURNING *`,
      [date, employment_status, aca_full_time, employee_name, note, location, department, job_title, reports_to, pay_rate, pay_type, pay_schedule, bonus_amount, bonus_date, bonus_reason, bonus_comment]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating jobs card:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}