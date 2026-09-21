const ORDINALS = { 1: '1st', 2: '2nd', 3: '3rd' };

function ordinal(n) {
  return ORDINALS[n] || `${n}th`;
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * @param {Array<{placement: number, team: string, school: string}>} results
 * @returns {string}
 */
export function renderResultsHTML(results) {
  if (!results || results.length === 0) {
    return `<p class="results-placeholder">Results will be posted here after the competition on 21–22 Nov 2026.</p>`;
  }

  const rows = results
    .slice()
    .sort((a, b) => a.placement - b.placement)
    .map(
      (r) => `
      <li class="results-row">
        <span class="results-row__place">${ordinal(r.placement)}</span>
        <span class="results-row__team">${escapeHTML(r.team)}</span>
        <span class="results-row__school">${escapeHTML(r.school)}</span>
      </li>`
    )
    .join('');

  return `<ul class="results-list">${rows}</ul>`;
}
