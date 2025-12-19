import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/employee-helpdesk/{id}:
 *   get:
 *     summary: Get a helpdesk ticket by ID
 *     description: Retrieve a single employee helpdesk ticket
 *     tags: [Employee Helpdesk]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID
 *     responses:
 *       200:
 *         description: Ticket details
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Server error
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const result = await query('SELECT * FROM employee_helpdesk WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching helpdesk ticket:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/employee-helpdesk/{id}:
 *   put:
 *     summary: Update a helpdesk ticket
 *     description: Update an existing employee helpdesk ticket
 *     tags: [Employee Helpdesk]
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
 *         description: Ticket updated successfully
 *       404:
 *         description: Ticket not found
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
      issue_type,
      description,
      date_raised,
      status,
      priority,
      resolution_date,
      assigned_to
    } = body;

    const result = await query(
      `UPDATE employee_helpdesk 
       SET employee_name = $1, employee_id = $2, department = $3, issue_type = $4, 
           description = $5, date_raised = $6, status = $7, priority = $8, 
           resolution_date = $9, assigned_to = $10, updated_at = NOW()
       WHERE id = $11
       RETURNING *`,
      [employee_name, employee_id, department, issue_type, description, date_raised, status, priority, resolution_date || null, assigned_to, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating helpdesk ticket:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/employee-helpdesk/{id}:
 *   delete:
 *     summary: Delete a helpdesk ticket
 *     description: Delete an employee helpdesk ticket
 *     tags: [Employee Helpdesk]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket deleted successfully
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Server error
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const result = await query('DELETE FROM employee_helpdesk WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Error deleting helpdesk ticket:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}