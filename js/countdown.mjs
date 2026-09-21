const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;

/**
 * Breaks the time remaining between `nowISO` and `targetISO` into
 * days / hours / minutes / seconds.
 *
 * @param {string} nowISO
 * @param {string} targetISO
 * @returns {{ days: number, hours: number, minutes: number, seconds: number, expired: boolean }}
 */
export function getCountdownParts(nowISO, targetISO) {
  const now = new Date(nowISO);
  const target = new Date(targetISO);

  if (Number.isNaN(now.getTime()) || Number.isNaN(target.getTime())) {
    throw new Error('Invalid date');
  }

  if (target <= now) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  let rest = target.getTime() - now.getTime();

  const days = Math.floor(rest / MS_PER_DAY);
  rest -= days * MS_PER_DAY;

  const hours = Math.floor(rest / MS_PER_HOUR);
  rest -= hours * MS_PER_HOUR;

  const minutes = Math.floor(rest / MS_PER_MINUTE);
  rest -= minutes * MS_PER_MINUTE;

  const seconds = Math.floor(rest / MS_PER_SECOND);

  return { days, hours, minutes, seconds, expired: false };
}
