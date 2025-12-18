export function validateRegistration(data) {
  const { email, password, full_name, role } = data;

  if (!email || !email.includes('@')) {
    return { valid: false, error: 'Valid email is required' };
  }

  if (!password || password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }

  if (!full_name || full_name.trim().length < 2) {
    return { valid: false, error: 'Full name is required' };
  }

  if (!role || role.trim().length === 0) {
    return { valid: false, error: 'Role is required' };
  }

  return { valid: true };
}

export function validateLogin(data) {
  const { email, password } = data;

  if (!email || !email.includes('@')) {
    return { valid: false, error: 'Valid email is required' };
  }

  if (!password || password.length === 0) {
    return { valid: false, error: 'Password is required' };
  }

  return { valid: true };
}