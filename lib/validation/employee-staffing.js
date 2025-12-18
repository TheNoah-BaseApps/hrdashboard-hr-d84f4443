import { STAFFING_STATUS } from '@/lib/utils/constants';

export function validateStaffing(data) {
  const {
    recruiting_source_budget,
    hire_goal,
    status,
    assigned_to
  } = data;

  if (!recruiting_source_budget || recruiting_source_budget <= 0) {
    return { valid: false, error: 'Valid recruiting budget is required (must be positive)' };
  }

  if (!hire_goal || hire_goal <= 0 || !Number.isInteger(Number(hire_goal))) {
    return { valid: false, error: 'Valid hire goal is required (must be positive integer)' };
  }

  if (!status || !STAFFING_STATUS.includes(status)) {
    return { valid: false, error: 'Valid status is required' };
  }

  if (!assigned_to || assigned_to.trim().length === 0) {
    return { valid: false, error: 'Assigned to is required' };
  }

  return { valid: true };
}