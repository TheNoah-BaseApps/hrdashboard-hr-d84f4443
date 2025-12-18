import { ACCESS_LEVELS, ACCESS_STATUS } from '@/lib/utils/constants';

export function validateAccessManagement(data) {
  const {
    employee_name,
    employee_id,
    department,
    access_level,
    system_access,
    granted_by,
    date_granted,
    expiry_date,
    status
  } = data;

  if (!employee_name || employee_name.trim().length === 0) {
    return { valid: false, error: 'Employee name is required' };
  }

  if (!employee_id || employee_id.trim().length === 0) {
    return { valid: false, error: 'Employee ID is required' };
  }

  if (!department || department.trim().length === 0) {
    return { valid: false, error: 'Department is required' };
  }

  if (!access_level || !ACCESS_LEVELS.includes(access_level)) {
    return { valid: false, error: 'Valid access level is required' };
  }

  if (!system_access || system_access.trim().length === 0) {
    return { valid: false, error: 'System access is required' };
  }

  if (!granted_by || granted_by.trim().length === 0) {
    return { valid: false, error: 'Granted by is required' };
  }

  if (!date_granted) {
    return { valid: false, error: 'Date granted is required' };
  }

  if (!expiry_date) {
    return { valid: false, error: 'Expiry date is required' };
  }

  // Validate expiry date is after grant date
  if (new Date(expiry_date) <= new Date(date_granted)) {
    return { valid: false, error: 'Expiry date must be after grant date' };
  }

  if (!status || !ACCESS_STATUS.includes(status)) {
    return { valid: false, error: 'Valid status is required' };
  }

  return { valid: true };
}