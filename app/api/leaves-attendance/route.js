import { NextResponse } from 'next/server';
import { query, getClient } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/leaves-attendance:
 *   get:
 *     summary: Get all leaves and attendance records
 *     description: Retrieve all employee leave requests and attendance records with pagination
 *     tags: [Leaves and Attendance]
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
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by leave type
 *     responses:
 *       200:
 *         description: Successfully retrieved leaves and attendance records
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
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    let queryText = 'SELECT * FROM leaves_attendance WHERE 1=1';
    let params = [];
    let paramCount = 0;

    if (status) {
      queryText += ' AND status = $' + (++paramCount);
      params.push(status);
    }

    if (type) {
      queryText += ' AND type = $' + (++paramCount);
      params.push(type);
    }

    queryText += ' ORDER BY date DESC LIMIT $' + (++paramCount) + ' OFFSET $' + (++paramCount);
    params.push(limit, offset);

    const result = await query(queryText, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching leaves and attendance:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/leaves-attendance:
 *   post:
 *     summary: Create a new leave/attendance record
 *     description: Create a new employee leave request or attendance record
 *     tags: [Leaves and Attendance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - status
 *               - type
 *               - duration
 *               - assigned_to
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *               type:
 *                 type: string
 *               duration:
 *                 type: string
 *               assigned_to:
 *                 type: string
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Leave/attendance record created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { date, status, type, duration, assigned_to, comment } = body;

    // Validation
    if (!date || !status || !type || !duration || !assigned_to) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO leaves_attendance (
        date, status, type, duration, assigned_to, comment, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *`,
      [date, status, type, duration, assigned_to, comment]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating leave/attendance record:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}