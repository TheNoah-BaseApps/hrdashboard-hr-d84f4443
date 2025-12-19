import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/talent-development/{id}:
 *   get:
 *     summary: Get talent development program by ID
 *     tags: [Talent Development]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const result = await query(
      'SELECT * FROM talent_development WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Talent development program not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: result.rows[0] 
    });
  } catch (error) {
    console.error('Error fetching talent development program:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/talent-development/{id}:
 *   put:
 *     summary: Update talent development program
 *     tags: [Talent Development]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully updated
 *       404:
 *         description: Not found
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
      training_program,
      program_start_date,
      program_end_date,
      progress_percentage,
      trainer_name,
      completion_status,
      remarks
    } = body;

    const result = await query(
      `UPDATE talent_development 
       SET employee_name = $1, employee_id = $2, department = $3, training_program = $4, 
           program_start_date = $5, program_end_date = $6, progress_percentage = $7, 
           trainer_name = $8, completion_status = $9, remarks = $10, updated_at = NOW()
       WHERE id = $11 
       RETURNING *`,
      [employee_name, employee_id, department, training_program, program_start_date, program_end_date, progress_percentage, trainer_name, completion_status, remarks, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Talent development program not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: result.rows[0] 
    });
  } catch (error) {
    console.error('Error updating talent development program:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/talent-development/{id}:
 *   delete:
 *     summary: Delete talent development program
 *     tags: [Talent Development]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const result = await query(
      'DELETE FROM talent_development WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Talent development program not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Talent development program deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting talent development program:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}