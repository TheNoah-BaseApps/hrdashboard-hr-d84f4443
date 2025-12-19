import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/pre-hire-management/{id}:
 *   get:
 *     summary: Get pre hire candidate by ID
 *     tags: [Pre Hire Management]
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
      'SELECT * FROM pre_hire_management WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Pre hire candidate not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: result.rows[0] 
    });
  } catch (error) {
    console.error('Error fetching pre hire candidate:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/pre-hire-management/{id}:
 *   put:
 *     summary: Update pre hire candidate
 *     tags: [Pre Hire Management]
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
      pre_hire_id,
      candidate_name,
      position_applied_for,
      department,
      application_date,
      resume_link,
      interview_scheduled_date,
      interviewer_name,
      interview_status,
      background_check_status,
      offer_letter_date,
      offer_acceptance_date,
      expected_joining_date,
      remarks
    } = body;

    const result = await query(
      `UPDATE pre_hire_management 
       SET pre_hire_id = $1, candidate_name = $2, position_applied_for = $3, department = $4, 
           application_date = $5, resume_link = $6, interview_scheduled_date = $7, interviewer_name = $8,
           interview_status = $9, background_check_status = $10, offer_letter_date = $11, 
           offer_acceptance_date = $12, expected_joining_date = $13, remarks = $14, updated_at = NOW()
       WHERE id = $15 
       RETURNING *`,
      [pre_hire_id, candidate_name, position_applied_for, department, application_date, resume_link, interview_scheduled_date, interviewer_name, interview_status, background_check_status, offer_letter_date, offer_acceptance_date, expected_joining_date, remarks, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Pre hire candidate not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: result.rows[0] 
    });
  } catch (error) {
    console.error('Error updating pre hire candidate:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/pre-hire-management/{id}:
 *   delete:
 *     summary: Delete pre hire candidate
 *     tags: [Pre Hire Management]
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
      'DELETE FROM pre_hire_management WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Pre hire candidate not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Pre hire candidate deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting pre hire candidate:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}