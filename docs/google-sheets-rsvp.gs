const SHEET_NAME = 'Confirmaciones';

function doPost(event) {
  const sheet = getSheet();
  const data = JSON.parse(event.postData.contents || '{}');

  ensureHeaders(sheet);

  sheet.appendRow([
    new Date(),
    data.guestName || '',
    data.attendance === 'si' ? 'Si asistiremos' : 'No podremos asistir',
    data.adults ?? '',
    data.kids ?? '',
    data.song || '',
    data.message || '',
    data.eventName || '',
    data.eventDate || '',
    data.venue || '',
    data.address || '',
    data.submittedAt || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, service: 'Megan 80s RSVP' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() > 0) return;

  sheet.appendRow([
    'Recibido',
    'Nombre',
    'Asistencia',
    'Adultos',
    'Ninos',
    'Cancion sugerida',
    'Mensaje',
    'Evento',
    'Fecha del evento',
    'Lugar',
    'Direccion',
    'Enviado desde web'
  ]);
}
