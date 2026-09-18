import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getStageState } from './funnel-state.mjs';

const OPEN = '2026-09-22T00:00:00+08:00';
const CLOSE = '2026-10-06T23:59:59+08:00';

test('returns "before" when now is earlier than the open date', () => {
  assert.equal(getStageState('2026-09-01T00:00:00+08:00', OPEN, CLOSE), 'before');
});

test('returns "open" when now is exactly the open instant', () => {
  assert.equal(getStageState(OPEN, OPEN, CLOSE), 'open');
});

test('returns "open" when now is between open and close', () => {
  assert.equal(getStageState('2026-09-25T12:00:00+08:00', OPEN, CLOSE), 'open');
});

test('returns "open" when now is exactly the close instant', () => {
  assert.equal(getStageState(CLOSE, OPEN, CLOSE), 'open');
});

test('returns "after" when now is later than the close date', () => {
  assert.equal(getStageState('2026-11-01T00:00:00+08:00', OPEN, CLOSE), 'after');
});

test('throws on an unparseable date string', () => {
  assert.throws(() => getStageState('not-a-date', OPEN, CLOSE), /Invalid date/);
});
