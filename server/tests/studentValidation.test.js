const test = require('node:test');
const assert = require('node:assert/strict');
const { validateStudent, validateId } = require('../middleware/studentValidation');
const valid = { first_name: ' Test ', last_name: ' Student ', email: 'TEST@EXAMPLE.COM' };
test('normalises required fields and empty optional values', () => {
  const result = validateStudent({ ...valid, year_of_study: '2', course: ' ' });
  assert.equal(result.first_name, 'Test');
  assert.equal(result.email, 'test@example.com');
  assert.equal(result.year_of_study, 2);
  assert.equal(result.course, null);
  assert.equal(result.bio, null);
});
test('rejects blank names, invalid email, invalid years and oversized text', () => {
  for (const fields of [{ first_name: ' ' }, { email: 'broken' }, { year_of_study: 0 }, { year_of_study: 11 }, { year_of_study: true }, { bio: 'x'.repeat(2001) }, { id: 1 }]) {
    assert.throws(() => validateStudent({ ...valid, ...fields }), { status: 400 });
  }
});
test('validates unsigned MySQL IDs', () => {
  assert.equal(validateId('12'), 12);
  for (const value of ['0', '-1', '1 OR 1=1', '1.5', '4294967296']) assert.throws(() => validateId(value), { status: 400 });
});
