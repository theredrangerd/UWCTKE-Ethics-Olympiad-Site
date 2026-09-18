// apps-script/Code.gs
//
// Deploy this as a Web App bound to a Google Sheet (see deployment steps
// below). doPost receives the Express Interest form's JSON body and
// appends one row per submission.

const SHEET_NAME = 'Interest Submissions';

function doPost(e) {
  const sheet = getOrCreateSheet_();
  const data = JSON.parse(e.postData.contents);

  // Reject bot submissions (honeypot field filled in).
  if (data.website && String(data.website).trim() !== '') {
    return jsonResponse_({ ok: false, error: 'rejected' });
  }

  const name = String(data.name || '').trim();
  const email = String(data.email || '').trim();
  const school = String(data.school || '').trim();
  const role = String(data.role || '').trim();

  if (!name || !email || !school || (role !== 'student' && role !== 'coach')) {
    return jsonResponse_({ ok: false, error: 'invalid submission' });
  }

  sheet.appendRow([new Date(), name, email, school, role]);

  return jsonResponse_({ ok: true });
}

function getOrCreateSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Name', 'Email', 'School', 'Role']);
  }
  return sheet;
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
