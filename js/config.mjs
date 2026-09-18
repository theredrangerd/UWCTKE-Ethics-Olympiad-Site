// js/config.mjs

export const Config = {
  // Funnel windows — Singapore time (UTC+8), per the proposal timeline.
  INTEREST_OPEN: '2026-09-22T00:00:00+08:00',
  INTEREST_CLOSE: '2026-10-06T23:59:59+08:00',
  REGISTRATION_OPEN: '2026-10-06T00:00:00+08:00',
  REGISTRATION_CLOSE: '2026-10-26T23:59:59+08:00',
  CASE_PACKAGE_DATE: '2026-10-29',
  COMPETITION_DATE: '2026-11-21', // tentative, per proposal

  // REPLACE after deploying the Apps Script Web App in Task 10 —
  // see apps-script/Code.gs deployment steps.
  APPS_SCRIPT_URL: 'REPLACE_WITH_DEPLOYED_APPS_SCRIPT_WEB_APP_URL',

  // REPLACE with the real registration Google Form link once it exists.
  REGISTRATION_FORM_URL: 'REPLACE_WITH_REGISTRATION_GOOGLE_FORM_URL',
};
