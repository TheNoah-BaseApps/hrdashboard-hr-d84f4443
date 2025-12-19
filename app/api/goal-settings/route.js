import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/goal-settings:
 *   get:
 *     summary: Get all goal settings
 *     description: Retrieve a list of all KPI and goal settings with pagination
 *     tags: [Goal Settings]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of items per page
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by KPI type
 *     responses:
 *       200:
 *         description: List of goal settings
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
 *                 pagination:
 *                   type: object
 *       500:
 *         description: Server error
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const type = searchParams.get('type');
    const offset = (page - 1) * limit;

    let queryText = 'SELECT * FROM goal_settings WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (type) {
      queryText += ` AND type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    const countResult = await query('SELECT COUNT(*) FROM goal_settings');
    const total = parseInt(countResult.rows[0].count);

    return NextResponse.json({
      success: true,
      data: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching goal settings:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/goal-settings:
 *   post:
 *     summary: Create a new goal setting
 *     description: Create a new KPI or goal setting
 *     tags: [Goal Settings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - kpi
 *               - type
 *               - purpose
 *               - definition
 *               - target
 *               - collection_frequency
 *               - reporting_frequency
 *             properties:
 *               kpi:
 *                 type: string
 *               type:
 *                 type: string
 *               purpose:
 *                 type: string
 *               definition:
 *                 type: string
 *               target:
 *                 type: string
 *               kpi_low_comment:
 *                 type: string
 *               kpi_high_comment:
 *                 type: string
 *               collection_frequency:
 *                 type: string
 *               reporting_frequency:
 *                 type: string
 *     responses:
 *       201:
 *         description: Goal setting created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      kpi,
      type,
      purpose,
      definition,
      target,
      kpi_low_comment,
      kpi_high_comment,
      collection_frequency,
      reporting_frequency
    } = body;

    if (!kpi || !type || !purpose || !definition || !target || !collection_frequency || !reporting_frequency) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO goal_settings 
       (kpi, type, purpose, definition, target, kpi_low_comment, kpi_high_comment, collection_frequency, reporting_frequency, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
       RETURNING *`,
      [kpi, type, purpose, definition, target, kpi_low_comment || null, kpi_high_comment || null, collection_frequency, reporting_frequency]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating goal setting:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}