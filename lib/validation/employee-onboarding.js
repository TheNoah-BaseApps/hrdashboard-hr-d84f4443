import { TASK_TYPES, TASK_STATUS } from '@/lib/utils/constants';

export function validateOnboarding(data) {
  const {
    task,
    type,
    assigned_to,
    name_of_employee,
    due_date,
    status
  } = data;

  if (!task || task.trim().length === 0) {
    return { valid: false, error: 'Task description is required' };
  }

  if (!type || !TASK_TYPES.includes(type)) {
    return { valid: false, error: 'Valid task type is required' };
  }

  if (!assigned_to || assigned_to.trim().length === 0) {
    return { valid: false, error: 'Assigned to is required' };
  }

  if (!name_of_employee || name_of_employee.trim().length === 0) {
    return { valid: false, error: 'Employee name is required' };
  }

  if (!due_date) {
    return { valid: false, error: 'Due date is required' };
  }

  // Validate due date is within 90 days
  const dueDateTime = new Date(due_date);
  const ninetyDaysFromNow = new Date();
  ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);

  if (dueDateTime > ninetyDaysFromNow) {
    return { valid: false, error: 'Due date must be within 90 days' };
  }

  if (!status || !TASK_STATUS.includes(status)) {
    return { valid: false, error: 'Valid status is required' };
  }

  return { valid: true };
}