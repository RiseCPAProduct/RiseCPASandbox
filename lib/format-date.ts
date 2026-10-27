const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Formats YYYY-MM or YYYY-MM-DD as "January 2026". Done by hand (no Intl)
// so server and client always render the same text.
export function formatMonthYear(date: string): string {
  const [year, month] = date.split("-").map(Number);
  return `${MONTHS[month - 1]} ${year}`;
}

// Formats YYYY-MM-DD as "November 4", for event dates.
export function formatDayMonth(date: string): string {
  const [, month, day] = date.split("-").map(Number);
  return `${MONTHS[month - 1]} ${day}`;
}
