import { hash, compare } from 'bcryptjs';

export async function hashPassword(password) {
  try {
    const hashedPassword = await hash(password, 10);
    return hashedPassword;
  } catch (error) {
    console.error('Hash password error:', error);
    throw new Error('Failed to hash password');
  }
}

export async function verifyPassword(password, hashedPassword) {
  try {
    const isValid = await compare(password, hashedPassword);
    return isValid;
  } catch (error) {
    console.error('Verify password error:', error);
    return false;
  }
}

export function validatePasswordStrength(password) {
  if (!password || password.length < 8) {
    return {
      valid: false,
      error: 'Password must be at least 8 characters long'
    };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    return {
      valid: false,
      error: 'Password must contain uppercase, lowercase, and numeric characters'
    };
  }

  return { valid: true };
}