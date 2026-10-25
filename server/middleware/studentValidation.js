const bad = message => { throw Object.assign(new Error(message), { status: 400 }); };
const lengths = { first_name: 100, last_name: 100, email: 254, student_number: 50, course: 150, bio: 2000 };
const required = new Set(['first_name', 'last_name', 'email']);
const validateId = raw => {
  if (!/^[1-9]\d*$/.test(String(raw)) || Number(raw) > 4294967295) bad('Student ID must be a positive integer.');
  return Number(raw);
};
const validateStudent = body => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) bad('A student object is required.');
  const allowed = new Set([...Object.keys(lengths), 'year_of_study']);
  if (Object.keys(body).some(key => !allowed.has(key))) bad('Unexpected or read-only student field.');
  const result = {};
  for (const [field, limit] of Object.entries(lengths)) {
    const value = body[field];
    if (value != null && typeof value !== 'string') bad(`${field} must be text.`);
    const clean = value?.trim() || '';
    if (required.has(field) && !clean) bad(`${field} is required.`);
    if ([...clean].length > limit) bad(`${field} must be at most ${limit} characters.`);
    result[field] = clean || null;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email)) bad('A valid email address is required.');
  result.email = result.email.toLowerCase();
  const year = body.year_of_study;
  if (year == null || year === '') result.year_of_study = null;
  else {
    if (!['number', 'string'].includes(typeof year) || !/^(10|[1-9])$/.test(String(year))) bad('Year of study must be between 1 and 10.');
    result.year_of_study = Number(year);
  }
  return result;
};
module.exports = { validateStudent, validateId };
