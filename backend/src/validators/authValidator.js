/**
 * Admin Authentication Request Validation
 */
export const validateLogin = (body = {}) => {
  const errors = [];

  if (!body.email || !body.email.trim()) {
    errors.push('Email is required');
  } else if (!/\S+@\S+\.\S+/.test(body.email)) {
    errors.push('A valid email address is required');
  }

  if (!body.password || body.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
