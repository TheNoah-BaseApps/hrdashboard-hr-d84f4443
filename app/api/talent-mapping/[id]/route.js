import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/talent-mapping/{id}:
 *   get:
 *     summary: Get talent mapping entry by ID
 *     tags: [Talent Mapping]
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
      'SELECT * FROM talent_mapping WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Talent mapping entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: result.rows[0] 
    });
  } catch (error) {
    console.error('Error fetching talent mapping entry:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/talent-mapping/{id}:
 *   put:
 *     summary: Update talent mapping entry
 *     tags: [Talent Mapping]
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
      employee_id,
      name_surname,
      department,
      position,
      years_of_experience,
      job_level,
      age,
      performance,
      potential,
      box_categorization
    } = body;

    const result = await query(
      `UPDATE talent_mapping 
       SET employee_id = $1, name_surname = $2, department = $3, position = $4, 
           years_of_experience = $5, job_level = $6, age = $7, performance = $8, 
           potential = $9, box_categorization = $10, updated_at = NOW()
       WHERE id = $11 
       RETURNING *`,
      [employee_id, name_surname, department, position, years_of_experience, job_level, age, performance, potential, box_categorization, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Talent mapping entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: result.rows[0] 
    });
  } catch (error) {
    console.error('Error updating talent mapping entry:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/talent-mapping/{id}:
 *   delete:
 *     summary: Delete talent mapping entry
 *     tags: [Talent Mapping]
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
      'DELETE FROM talent_mapping WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Talent mapping entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Talent mapping entry deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting talent mapping entry:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}