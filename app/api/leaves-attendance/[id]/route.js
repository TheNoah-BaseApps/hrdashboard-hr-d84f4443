import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/leaves-attendance/{id}:
 *   get:
 *     summary: Get a leave/attendance record by ID
 *     description: Retrieve a single employee leave or attendance record
 *     tags: [Leaves and Attendance]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Leave/attendance record ID
 *     responses:
 *       200:
 *         description: Successfully retrieved record
 *       404:
 *         description: Record not found
 *       500:
 *         description: Server error
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const result = await query('SELECT * FROM leaves_attendance WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Leave/attendance record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching leave/attendance record:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/leaves-attendance/{id}:
 *   put:
 *     summary: Update a leave/attendance record
 *     description: Update an existing employee leave or attendance record
 *     tags: [Leaves and Attendance]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Leave/attendance record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Record updated successfully
 *       404:
 *         description: Record not found
 *       500:
 *         description: Server error
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { date, status, type, duration, assigned_to, comment } = body;

    const result = await query(
      `UPDATE leaves_attendance SET
        date = COALESCE($1, date),
        status = COALESCE($2, status),
        type = COALESCE($3, type),
        duration = COALESCE($4, duration),
        assigned_to = COALESCE($5, assigned_to),
        comment = $6,
        updated_at = NOW()
      WHERE id = $7
      RETURNING *`,
      [date, status, type, duration, assigned_to, comment, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Leave/attendance record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating leave/attendance record:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/leaves-attendance/{id}:
 *   delete:
 *     summary: Delete a leave/attendance record
 *     description: Delete an employee leave or attendance record
 *     tags: [Leaves and Attendance]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Leave/attendance record ID
 *     responses:
 *       200:
 *         description: Record deleted successfully
 *       404:
 *         description: Record not found
 *       500:
 *         description: Server error
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const result = await query('DELETE FROM leaves_attendance WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Leave/attendance record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Leave/attendance record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting leave/attendance record:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}