import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderResultsHTML } from './results-render.mjs';

test('renders a "coming soon" placeholder when results is empty', () => {
  const html = renderResultsHTML([]);
  assert.match(html, /Results will be posted here after the competition/);
});

test('renders a ranked list when results is populated', () => {
  const html = renderResultsHTML([
    { placement: 1, team: 'Team Socrates', school: 'UWC South East Asia' },
    { placement: 2, team: 'Team Kant', school: 'UWC Atlantic' },
  ]);
  assert.match(html, /1st/);
  assert.match(html, /Team Socrates/);
  assert.match(html, /UWC South East Asia/);
  assert.match(html, /2nd/);
  assert.match(html, /Team Kant/);
});

test('escapes HTML in team/school names to prevent injection', () => {
  const html = renderResultsHTML([
    { placement: 1, team: '<script>alert(1)</script>', school: 'X' },
  ]);
  assert.ok(!html.includes('<script>alert(1)</script>'));
  assert.match(html, /&lt;script&gt;/);
});
