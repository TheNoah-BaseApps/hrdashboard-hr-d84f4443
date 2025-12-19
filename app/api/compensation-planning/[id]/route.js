import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/compensation-planning/{id}:
 *   get:
 *     summary: Get a specific compensation planning record
 *     description: Retrieve a single compensation planning record by ID
 *     tags: [Compensation Planning]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Compensation planning record ID
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
    const result = await query(
      'SELECT * FROM compensation_planning WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching compensation planning record:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/compensation-planning/{id}:
 *   put:
 *     summary: Update a compensation planning record
 *     description: Update an existing compensation planning record
 *     tags: [Compensation Planning]
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
    
    const {
      employee_name,
      employee_id,
      department,
      current_salary,
      proposed_increase,
      review_date,
      approval_status,
      remarks,
      decision_maker,
      effective_date
    } = body;

    const result = await query(
      `UPDATE compensation_planning 
       SET employee_name = $1, employee_id = $2, department = $3, 
           current_salary = $4, proposed_increase = $5, review_date = $6,
           approval_status = $7, remarks = $8, decision_maker = $9, 
           effective_date = $10, updated_at = now()
       WHERE id = $11
       RETURNING *`,
      [employee_name, employee_id, department, current_salary, proposed_increase,
       review_date, approval_status, remarks, decision_maker, effective_date, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating compensation planning record:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/compensation-planning/{id}:
 *   delete:
 *     summary: Delete a compensation planning record
 *     description: Delete a compensation planning record by ID
 *     tags: [Compensation Planning]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
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
    const result = await query(
      'DELETE FROM compensation_planning WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Record deleted successfully' });
  } catch (error) {
    console.error('Error deleting compensation planning record:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}