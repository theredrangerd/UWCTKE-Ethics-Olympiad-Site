import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getCountdownParts } from './countdown.mjs';

test('returns expired when the target is in the past', () => {
  const result = getCountdownParts('2026-10-07T00:00:00+08:00', '2026-10-06T00:00:00+08:00');
  assert.deepEqual(result, { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
});

test('returns expired when now equals the target', () => {
  const result = getCountdownParts('2026-10-06T00:00:00+08:00', '2026-10-06T00:00:00+08:00');
  assert.equal(result.expired, true);
});

test('splits the remaining time into days, hours, minutes, seconds', () => {
  const result = getCountdownParts('2026-09-21T00:00:00Z', '2026-10-06T05:27:30Z');
  assert.equal(result.expired, false);
  assert.equal(result.days, 15);
  assert.equal(result.hours, 5);
  assert.equal(result.minutes, 27);
  assert.equal(result.seconds, 30);
});

test('handles a gap smaller than a day', () => {
  const result = getCountdownParts('2026-10-05T20:00:00Z', '2026-10-06T00:00:00Z');
  assert.equal(result.days, 0);
  assert.equal(result.hours, 4);
  assert.equal(result.minutes, 0);
  assert.equal(result.seconds, 0);
});

test('throws on an unparseable date string', () => {
  assert.throws(() => getCountdownParts('not-a-date', '2026-10-06T00:00:00Z'), /Invalid date/);
});
