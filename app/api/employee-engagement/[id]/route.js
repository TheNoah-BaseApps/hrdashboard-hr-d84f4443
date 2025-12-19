import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/employee-engagement/{id}:
 *   get:
 *     summary: Get a specific employee engagement activity
 *     description: Retrieve a single engagement activity by ID
 *     tags: [Employee Engagement]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Successfully retrieved activity
 *       404:
 *         description: Activity not found
 *       500:
 *         description: Server error
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const result = await query(
      'SELECT * FROM employee_engagement WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Activity not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching employee engagement activity:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/employee-engagement/{id}:
 *   put:
 *     summary: Update an employee engagement activity
 *     description: Update an existing engagement activity
 *     tags: [Employee Engagement]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Activity updated successfully
 *       404:
 *         description: Activity not found
 *       500:
 *         description: Server error
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const {
      employee_name,
      employee_id,
      department,
      engagement_activity,
      date_of_activity,
      feedback,
      satisfaction_score,
      suggestions,
      organizer,
      status
    } = body;

    const result = await query(
      `UPDATE employee_engagement 
       SET employee_name = $1, employee_id = $2, department = $3,
           engagement_activity = $4, date_of_activity = $5, feedback = $6,
           satisfaction_score = $7, suggestions = $8, organizer = $9,
           status = $10, updated_at = now()
       WHERE id = $11
       RETURNING *`,
      [employee_name, employee_id, department, engagement_activity, date_of_activity,
       feedback, satisfaction_score, suggestions, organizer, status, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Activity not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating employee engagement activity:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/employee-engagement/{id}:
 *   delete:
 *     summary: Delete an employee engagement activity
 *     description: Delete an engagement activity by ID
 *     tags: [Employee Engagement]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Activity deleted successfully
 *       404:
 *         description: Activity not found
 *       500:
 *         description: Server error
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const result = await query(
      'DELETE FROM employee_engagement WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Activity not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee engagement activity:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}