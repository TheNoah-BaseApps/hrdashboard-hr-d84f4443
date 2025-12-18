import { query } from '@/lib/database/aurora';

export async function createAuditLog({ workflow_name, record_id, action, user_id, changes }) {
  try {
    await query(
      `INSERT INTO workflow_audit 
       (workflow_name, record_id, action, user_id, timestamp, changes)
       VALUES ($1, $2, $3, $4, NOW(), $5)`,
      [workflow_name, record_id, action, user_id, JSON.stringify(changes)]
    );
  } catch (error) {
    console.error('Create audit log error:', error);
    // Don't throw - audit logging should not break the main operation
  }
}

export async function getAuditLogs(workflow_name, record_id) {
  try {
    const result = await query(
      `SELECT wa.*, u.full_name as user_name
       FROM workflow_audit wa
       LEFT JOIN users u ON wa.user_id = u.id
       WHERE wa.workflow_name = $1 AND wa.record_id = $2
       ORDER BY wa.timestamp DESC`,
      [workflow_name, record_id]
    );

    return result.rows;
  } catch (error) {
    console.error('Get audit logs error:', error);
    return [];
  }
}

export async function getRecentAuditLogs(limit = 50) {
  try {
    const result = await query(
      `SELECT wa.*, u.full_name as user_name
       FROM workflow_audit wa
       LEFT JOIN users u ON wa.user_id = u.id
       ORDER BY wa.timestamp DESC
       LIMIT $1`,
      [limit]
    );

    return result.rows;
  } catch (error) {
    console.error('Get recent audit logs error:', error);
    return [];
  }
}