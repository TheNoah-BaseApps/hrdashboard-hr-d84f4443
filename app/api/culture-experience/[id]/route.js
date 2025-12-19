import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/culture-experience/{id}:
 *   get:
 *     summary: Get a specific culture and experience initiative
 *     description: Retrieve a single initiative by ID
 *     tags: [Culture and Experience]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Successfully retrieved initiative
 *       404:
 *         description: Initiative not found
 *       500:
 *         description: Server error
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const result = await query(
      'SELECT * FROM culture_experience WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Initiative not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching culture experience initiative:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/culture-experience/{id}:
 *   put:
 *     summary: Update a culture and experience initiative
 *     description: Update an existing initiative
 *     tags: [Culture and Experience]
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
 *         description: Initiative updated successfully
 *       404:
 *         description: Initiative not found
 *       500:
 *         description: Server error
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const {
      initiative_name,
      team_involved,
      date_of_initiative,
      department,
      feedback,
      status,
      contact_person,
      action_plan
    } = body;

    const result = await query(
      `UPDATE culture_experience 
       SET initiative_name = $1, team_involved = $2, date_of_initiative = $3,
           department = $4, feedback = $5, status = $6,
           contact_person = $7, action_plan = $8, updated_at = now()
       WHERE id = $9
       RETURNING *`,
      [initiative_name, team_involved, date_of_initiative, department,
       feedback, status, contact_person, action_plan, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Initiative not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating culture experience initiative:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/culture-experience/{id}:
 *   delete:
 *     summary: Delete a culture and experience initiative
 *     description: Delete an initiative by ID
 *     tags: [Culture and Experience]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Initiative deleted successfully
 *       404:
 *         description: Initiative not found
 *       500:
 *         description: Server error
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const result = await query(
      'DELETE FROM culture_experience WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Initiative not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Initiative deleted successfully' });
  } catch (error) {
    console.error('Error deleting culture experience initiative:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}