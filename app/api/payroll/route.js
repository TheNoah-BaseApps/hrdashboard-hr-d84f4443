import { NextResponse } from 'next/server';
import { query, getClient } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/payroll:
 *   get:
 *     summary: Get all payroll records
 *     description: Retrieve all employee payroll and compensation information with pagination
 *     tags: [Payroll]
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
 *     responses:
 *       200:
 *         description: Successfully retrieved payroll records
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

    const result = await query(
      'SELECT * FROM payroll ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching payroll records:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/payroll:
 *   post:
 *     summary: Create a new payroll record
 *     description: Create a new employee payroll and compensation record
 *     tags: [Payroll]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - ssn
 *               - address
 *               - occupation
 *               - gender
 *               - hire_date
 *               - salary
 *               - exempt_from_overtime
 *               - federal_allowances
 *             properties:
 *               name:
 *                 type: string
 *               ssn:
 *                 type: string
 *               address:
 *                 type: string
 *               occupation:
 *                 type: string
 *               gender:
 *                 type: string
 *               hire_date:
 *                 type: string
 *                 format: date-time
 *               salary:
 *                 type: integer
 *               regular_hourly_rate:
 *                 type: integer
 *               overtime_hourly_rate:
 *                 type: integer
 *               exempt_from_overtime:
 *                 type: boolean
 *               federal_allowances:
 *                 type: integer
 *               retirement_contribution:
 *                 type: integer
 *               insurance_deduction:
 *                 type: integer
 *               other_deductions:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Payroll record created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name, ssn, address, occupation, gender, hire_date, salary,
      regular_hourly_rate, overtime_hourly_rate, exempt_from_overtime,
      federal_allowances, retirement_contribution, insurance_deduction, other_deductions
    } = body;

    // Validation
    if (!name || !ssn || !address || !occupation || !gender || !hire_date || !salary || exempt_from_overtime === undefined || !federal_allowances) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO payroll (
        name, ssn, address, occupation, gender, hire_date, salary,
        regular_hourly_rate, overtime_hourly_rate, exempt_from_overtime,
        federal_allowances, retirement_contribution, insurance_deduction, other_deductions,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW())
      RETURNING *`,
      [name, ssn, address, occupation, gender, hire_date, salary, regular_hourly_rate, overtime_hourly_rate, exempt_from_overtime, federal_allowances, retirement_contribution, insurance_deduction, other_deductions]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating payroll record:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}