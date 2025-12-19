import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/jobs-card/{id}:
 *   get:
 *     summary: Get a jobs card by ID
 *     description: Retrieve a single employee job information card
 *     tags: [Jobs Card]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Jobs card ID
 *     responses:
 *       200:
 *         description: Successfully retrieved jobs card
 *       404:
 *         description: Jobs card not found
 *       500:
 *         description: Server error
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const result = await query('SELECT * FROM jobs_card WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Jobs card not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching jobs card:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/jobs-card/{id}:
 *   put:
 *     summary: Update a jobs card
 *     description: Update an existing employee job information card
 *     tags: [Jobs Card]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Jobs card ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Jobs card updated successfully
 *       404:
 *         description: Jobs card not found
 *       500:
 *         description: Server error
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
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

    const result = await query(
      `UPDATE jobs_card SET
        date = COALESCE($1, date),
        employment_status = COALESCE($2, employment_status),
        aca_full_time = COALESCE($3, aca_full_time),
        employee_name = COALESCE($4, employee_name),
        note = $5,
        location = COALESCE($6, location),
        department = COALESCE($7, department),
        job_title = COALESCE($8, job_title),
        reports_to = COALESCE($9, reports_to),
        pay_rate = COALESCE($10, pay_rate),
        pay_type = COALESCE($11, pay_type),
        pay_schedule = COALESCE($12, pay_schedule),
        bonus_amount = $13,
        bonus_date = $14,
        bonus_reason = $15,
        bonus_comment = $16,
        updated_at = NOW()
      WHERE id = $17
      RETURNING *`,
      [date, employment_status, aca_full_time, employee_name, note, location, department, job_title, reports_to, pay_rate, pay_type, pay_schedule, bonus_amount, bonus_date, bonus_reason, bonus_comment, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Jobs card not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating jobs card:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/jobs-card/{id}:
 *   delete:
 *     summary: Delete a jobs card
 *     description: Delete an employee job information card
 *     tags: [Jobs Card]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Jobs card ID
 *     responses:
 *       200:
 *         description: Jobs card deleted successfully
 *       404:
 *         description: Jobs card not found
 *       500:
 *         description: Server error
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const result = await query('DELETE FROM jobs_card WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Jobs card not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Jobs card deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting jobs card:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}