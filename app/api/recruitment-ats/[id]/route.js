import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/recruitment-ats/{id}:
 *   get:
 *     summary: Get recruitment applicant by ID
 *     tags: [Recruitment ATS]
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
      'SELECT * FROM recruitment_ats WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Recruitment applicant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: result.rows[0] 
    });
  } catch (error) {
    console.error('Error fetching recruitment applicant:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/recruitment-ats/{id}:
 *   put:
 *     summary: Update recruitment applicant
 *     tags: [Recruitment ATS]
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
      applicant_name,
      phone_number,
      position_title,
      date_applied,
      experience,
      question1,
      answer1,
      question2,
      answer2,
      question3,
      answer3,
      question4,
      answer4,
      question5,
      answer5
    } = body;

    const result = await query(
      `UPDATE recruitment_ats 
       SET applicant_name = $1, phone_number = $2, position_title = $3, date_applied = $4, 
           experience = $5, question1 = $6, answer1 = $7, question2 = $8, answer2 = $9,
           question3 = $10, answer3 = $11, question4 = $12, answer4 = $13, 
           question5 = $14, answer5 = $15, updated_at = NOW()
       WHERE id = $16 
       RETURNING *`,
      [applicant_name, phone_number, position_title, date_applied, experience, question1, answer1, question2, answer2, question3, answer3, question4, answer4, question5, answer5, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Recruitment applicant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: result.rows[0] 
    });
  } catch (error) {
    console.error('Error updating recruitment applicant:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/recruitment-ats/{id}:
 *   delete:
 *     summary: Delete recruitment applicant
 *     tags: [Recruitment ATS]
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
      'DELETE FROM recruitment_ats WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Recruitment applicant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Recruitment applicant deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting recruitment applicant:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}