const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function ensureISODate(input) {
  if (!ISO_DATE_REGEX.test(input)) {
    const error = new Error('Invalid date format. Use YYYY-MM-DD.');
    error.status = 400;
    throw error;
  }

  const [year, month, day] = input.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const iso = date.toISOString().slice(0, 10);

  if (iso !== input) {
    const error = new Error('Invalid date value.');
    error.status = 400;
    throw error;
  }

  return input;
}

function formatISODateLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseISODateLocal(dateISO) {
  const [year, month, day] = dateISO.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
}

function getWeekStart(dateISO) {
  ensureISODate(dateISO);
  const date = parseISODateLocal(dateISO);
  const dayOfWeek = date.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  date.setDate(date.getDate() + diff);
  return formatISODateLocal(date);
}

function listWeekDates(weekStartISO) {
  ensureISODate(weekStartISO);
  const start = parseISODateLocal(weekStartISO);
  const dates = [];

  for (let i = 0; i < 7; i += 1) {
    const current = new Date(start);
    current.setDate(start.getDate() + i);
    dates.push(formatISODateLocal(current));
  }

  return dates;
}

function listDateRange(startISO, endISO) {
  ensureISODate(startISO);
  ensureISODate(endISO);
  if (startISO > endISO) {
    const error = new Error('Invalid date range.');
    error.status = 400;
    throw error;
  }
  const start = parseISODateLocal(startISO);
  const end = parseISODateLocal(endISO);
  const dates = [];

  for (let current = new Date(start); current <= end; current.setDate(current.getDate() + 1)) {
    dates.push(formatISODateLocal(current));
  }

  return dates;
}

module.exports = { ensureISODate, getWeekStart, listWeekDates, listDateRange };
