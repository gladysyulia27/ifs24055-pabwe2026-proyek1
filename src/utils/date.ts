export const todayISO = (): string => new Date().toISOString().slice(0, 10);

/** Formats a calendar day as YYYY-MM-DD (monthIndex is zero-based). */
export const toDateKey = (year: number, monthIndex: number, day: number): string =>
  `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
