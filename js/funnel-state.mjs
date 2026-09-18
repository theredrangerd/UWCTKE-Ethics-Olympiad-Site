/**
 * @param {string} nowISO
 * @param {string} openISO
 * @param {string} closeISO
 * @returns {'before' | 'open' | 'after'}
 */
export function getStageState(nowISO, openISO, closeISO) {
  const now = new Date(nowISO);
  const open = new Date(openISO);
  const close = new Date(closeISO);

  for (const [label, d] of [['now', now], ['open', open], ['close', close]]) {
    if (Number.isNaN(d.getTime())) {
      throw new Error(`Invalid date: ${label}`);
    }
  }

  if (now < open) return 'before';
  if (now > close) return 'after';
  return 'open';
}
