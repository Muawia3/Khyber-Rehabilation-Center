/**
 * Contact & Admission Inquiry Request Validation & Sanitization
 */
export const validateInquiry = (body = {}) => {
  const errors = [];
  const sanitized = {};

  // Strip basic HTML/script tags helper
  const sanitizeString = (str) => (typeof str === 'string' ? str.replace(/<[^>]*>?/gm, '').trim() : '');

  // 1. Full Name
  const fullName = sanitizeString(body.fullName);
  if (!fullName) {
    errors.push('Full name is required');
  } else if (fullName.length < 2 || fullName.length > 100) {
    errors.push('Full name must be between 2 and 100 characters');
  }
  sanitized.fullName = fullName;

  // 2. Phone Number
  const phone = sanitizeString(body.phone);
  if (!phone) {
    errors.push('Contact phone number is required');
  } else if (!/^[\d\s+\-()]{7,25}$/.test(phone)) {
    errors.push('Please provide a valid contact phone number (at least 7 digits)');
  }
  sanitized.phone = phone;

  // 3. Email (Optional)
  if (body.email && typeof body.email === 'string' && body.email.trim()) {
    const email = body.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('If provided, email must be a valid email address');
    } else {
      sanitized.email = email;
    }
  } else {
    sanitized.email = null;
  }

  // 4. Inquiry Type
  const allowedTypes = [
    'Admission & Detox',
    'Psychological Therapy',
    'Vocational Training',
    'Product Order',
    'Family Support',
    'General Information',
  ];
  const inquiryType = sanitizeString(body.inquiryType);
  sanitized.inquiryType = allowedTypes.includes(inquiryType) ? inquiryType : 'General Information';

  // 5. Message
  const message = sanitizeString(body.message);
  if (!message) {
    errors.push('Message is required');
  } else if (message.length < 10) {
    errors.push('Message must contain at least 10 characters');
  } else if (message.length > 2500) {
    errors.push('Message cannot exceed 2500 characters');
  }
  sanitized.message = message;

  return {
    isValid: errors.length === 0,
    errors,
    data: sanitized,
  };
};
