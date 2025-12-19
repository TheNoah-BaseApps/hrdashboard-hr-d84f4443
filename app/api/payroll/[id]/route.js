import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/payroll/{id}:
 *   get:
 *     summary: Get a payroll record by ID
 *     description: Retrieve a single employee payroll record
 *     tags: [Payroll]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payroll record ID
 *     responses:
 *       200:
 *         description: Successfully retrieved payroll record
 *       404:
 *         description: Record not found
 *       500:
 *         description: Server error
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const result = await query('SELECT * FROM payroll WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Payroll record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching payroll record:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/payroll/{id}:
 *   put:
 *     summary: Update a payroll record
 *     description: Update an existing employee payroll record
 *     tags: [Payroll]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payroll record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Payroll record updated successfully
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
      name, ssn, address, occupation, gender, hire_date, salary,
      regular_hourly_rate, overtime_hourly_rate, exempt_from_overtime,
      federal_allowances, retirement_contribution, insurance_deduction, other_deductions
    } = body;

    const result = await query(
      `UPDATE payroll SET
        name = COALESCE($1, name),
        ssn = COALESCE($2, ssn),
        address = COALESCE($3, address),
        occupation = COALESCE($4, occupation),
        gender = COALESCE($5, gender),
        hire_date = COALESCE($6, hire_date),
        salary = COALESCE($7, salary),
        regular_hourly_rate = $8,
        overtime_hourly_rate = $9,
        exempt_from_overtime = COALESCE($10, exempt_from_overtime),
        federal_allowances = COALESCE($11, federal_allowances),
        retirement_contribution = $12,
        insurance_deduction = $13,
        other_deductions = $14,
        updated_at = NOW()
      WHERE id = $15
      RETURNING *`,
      [name, ssn, address, occupation, gender, hire_date, salary, regular_hourly_rate, overtime_hourly_rate, exempt_from_overtime, federal_allowances, retirement_contribution, insurance_deduction, other_deductions, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Payroll record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating payroll record:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/payroll/{id}:
 *   delete:
 *     summary: Delete a payroll record
 *     description: Delete an employee payroll record
 *     tags: [Payroll]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payroll record ID
 *     responses:
 *       200:
 *         description: Payroll record deleted successfully
 *       404:
 *         description: Record not found
 *       500:
 *         description: Server error
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const result = await query('DELETE FROM payroll WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Payroll record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payroll record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting payroll record:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}