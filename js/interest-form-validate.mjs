const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_ROLES = new Set(['student', 'coach']);

/**
 * @param {{name: string, email: string, school: string, role: string, website: string}} fields
 * @returns {{valid: boolean, errors: Record<string,string>}}
 */
export function validateInterestForm(fields) {
  const errors = {};

  if (fields.website && fields.website.trim() !== '') {
    errors.website = 'Submission rejected.';
    return { valid: false, errors };
  }

  if (!fields.name || fields.name.trim() === '') {
    errors.name = 'Please enter your name.';
  }

  if (!fields.email || !EMAIL_RE.test(fields.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!fields.school || fields.school.trim() === '') {
    errors.school = 'Please enter your school.';
  }

  if (!VALID_ROLES.has(fields.role)) {
    errors.role = 'Please select whether you are a student or a coach/teacher.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
