import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/employee-rewards/{id}:
 *   get:
 *     summary: Get an employee reward by ID
 *     description: Retrieve a single employee reward
 *     tags: [Employee Rewards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reward ID
 *     responses:
 *       200:
 *         description: Reward details
 *       404:
 *         description: Reward not found
 *       500:
 *         description: Server error
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const result = await query('SELECT * FROM employee_rewards WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Reward not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching employee reward:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/employee-rewards/{id}:
 *   put:
 *     summary: Update an employee reward
 *     description: Update an existing employee reward
 *     tags: [Employee Rewards]
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
 *         description: Reward updated successfully
 *       404:
 *         description: Reward not found
 *       500:
 *         description: Server error
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const {
      benefit_type,
      plan_name,
      date,
      coverage,
      employee_pays,
      company_pays,
      frequency
    } = body;

    const result = await query(
      `UPDATE employee_rewards 
       SET benefit_type = $1, plan_name = $2, date = $3, coverage = $4, 
           employee_pays = $5, company_pays = $6, frequency = $7, updated_at = NOW()
       WHERE id = $8
       RETURNING *`,
      [benefit_type, plan_name, date, coverage, employee_pays, company_pays, frequency, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Reward not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating employee reward:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/employee-rewards/{id}:
 *   delete:
 *     summary: Delete an employee reward
 *     description: Delete an employee reward
 *     tags: [Employee Rewards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reward deleted successfully
 *       404:
 *         description: Reward not found
 *       500:
 *         description: Server error
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const result = await query('DELETE FROM employee_rewards WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Reward not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Reward deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee reward:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}