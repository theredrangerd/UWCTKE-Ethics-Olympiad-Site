import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateInterestForm } from './interest-form-validate.mjs';

const validFields = {
  name: 'Ada Lovelace',
  email: 'ada@example.edu',
  school: 'UWC South East Asia',
  role: 'student',
  website: '',
};

test('accepts a fully valid submission', () => {
  const result = validateInterestForm(validFields);
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, {});
});

test('rejects a missing name', () => {
  const result = validateInterestForm({ ...validFields, name: '  ' });
  assert.equal(result.valid, false);
  assert.equal(result.errors.name, 'Please enter your name.');
});

test('rejects an invalid email', () => {
  const result = validateInterestForm({ ...validFields, email: 'not-an-email' });
  assert.equal(result.valid, false);
  assert.equal(result.errors.email, 'Please enter a valid email address.');
});

test('rejects a missing school', () => {
  const result = validateInterestForm({ ...validFields, school: '' });
  assert.equal(result.valid, false);
  assert.equal(result.errors.school, 'Please enter your school.');
});

test('rejects a role outside student/coach', () => {
  const result = validateInterestForm({ ...validFields, role: 'alien' });
  assert.equal(result.valid, false);
  assert.equal(result.errors.role, 'Please select whether you are a student or a coach/teacher.');
});

test('rejects a filled-in honeypot field as a bot submission', () => {
  const result = validateInterestForm({ ...validFields, website: 'http://spam.example' });
  assert.equal(result.valid, false);
  assert.equal(result.errors.website, 'Submission rejected.');
});

test('reports multiple errors at once', () => {
  const result = validateInterestForm({ name: '', email: '', school: '', role: '', website: '' });
  assert.equal(result.valid, false);
  assert.equal(Object.keys(result.errors).length, 4);
});
