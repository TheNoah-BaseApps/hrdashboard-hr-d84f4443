import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/goal-settings/{id}:
 *   get:
 *     summary: Get a goal setting by ID
 *     description: Retrieve a single goal setting
 *     tags: [Goal Settings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Goal setting ID
 *     responses:
 *       200:
 *         description: Goal setting details
 *       404:
 *         description: Goal setting not found
 *       500:
 *         description: Server error
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const result = await query('SELECT * FROM goal_settings WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Goal setting not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching goal setting:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/goal-settings/{id}:
 *   put:
 *     summary: Update a goal setting
 *     description: Update an existing goal setting
 *     tags: [Goal Settings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Goal setting updated successfully
 *       404:
 *         description: Goal setting not found
 *       500:
 *         description: Server error
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const {
      kpi,
      type,
      purpose,
      definition,
      target,
      kpi_low_comment,
      kpi_high_comment,
      collection_frequency,
      reporting_frequency
    } = body;

    const result = await query(
      `UPDATE goal_settings 
       SET kpi = $1, type = $2, purpose = $3, definition = $4, target = $5, 
           kpi_low_comment = $6, kpi_high_comment = $7, collection_frequency = $8, 
           reporting_frequency = $9, updated_at = NOW()
       WHERE id = $10
       RETURNING *`,
      [kpi, type, purpose, definition, target, kpi_low_comment || null, kpi_high_comment || null, collection_frequency, reporting_frequency, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Goal setting not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating goal setting:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/goal-settings/{id}:
 *   delete:
 *     summary: Delete a goal setting
 *     description: Delete a goal setting
 *     tags: [Goal Settings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Goal setting deleted successfully
 *       404:
 *         description: Goal setting not found
 *       500:
 *         description: Server error
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const result = await query('DELETE FROM goal_settings WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Goal setting not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Goal setting deleted successfully' });
  } catch (error) {
    console.error('Error deleting goal setting:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}