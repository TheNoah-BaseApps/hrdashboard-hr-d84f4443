import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';
import { verifyAuth } from '@/lib/auth/middleware';

/**
 * @swagger
 * /api/dashboard/metrics:
 *   get:
 *     summary: Retrieve aggregated metrics across workflows
 *     tags: [Dashboard]
 */
export async function GET(request) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get access management metrics
    const accessMetrics = await query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'Active') as active,
        COUNT(*) FILTER (WHERE status = 'Expired') as expired,
        COUNT(*) FILTER (WHERE status = 'Pending') as pending
      FROM access_management
    `);

    // Get onboarding metrics
    const onboardingMetrics = await query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'Pending') as pending,
        COUNT(*) FILTER (WHERE status = 'In Progress') as in_progress,
        COUNT(*) FILTER (WHERE status = 'Completed') as completed,
        COUNT(*) FILTER (WHERE status = 'Overdue') as overdue
      FROM employee_onboarding
    `);

    // Get staffing metrics
    const staffingMetrics = await query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'Active') as active,
        COUNT(*) FILTER (WHERE funded = true) as funded,
        COUNT(*) FILTER (WHERE funded = false) as unfunded,
        SUM(recruiting_source_budget) as total_budget,
        SUM(hire_goal) as total_hire_goal
      FROM employee_staffing
    `);

    const access = accessMetrics.rows[0];
    const onboarding = onboardingMetrics.rows[0];
    const staffing = staffingMetrics.rows[0];

    return NextResponse.json(
      {
        success: true,
        data: {
          totalEmployees: parseInt(access.total) || 0,
          activeAccess: parseInt(access.active) || 0,
          expiredAccess: parseInt(access.expired) || 0,
          pendingAccess: parseInt(access.pending) || 0,
          
          onboardingTasks: parseInt(onboarding.total) || 0,
          activeOnboarding: parseInt(onboarding.in_progress) || 0,
          completedOnboarding: parseInt(onboarding.completed) || 0,
          overdueOnboarding: parseInt(onboarding.overdue) || 0,
          
          activeStaffing: parseInt(staffing.active) || 0,
          fundedStaffing: parseInt(staffing.funded) || 0,
          unfundedStaffing: parseInt(staffing.unfunded) || 0,
          totalBudget: parseFloat(staffing.total_budget) || 0,
          totalHireGoal: parseInt(staffing.total_hire_goal) || 0
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get dashboard metrics error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard metrics' },
      { status: 500 }
    );
  }
}