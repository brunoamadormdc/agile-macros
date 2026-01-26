export function toISODateLocal(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateBR(isoDate) {
  if (!isoDate) {
    return '';
  }
  const [year, month, day] = isoDate.split('-');
  if (!year || !month || !day) {
    return isoDate;
  }
  return `${day}/${month}/${year}`;
}
