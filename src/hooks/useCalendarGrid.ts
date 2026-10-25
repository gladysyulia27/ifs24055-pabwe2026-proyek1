import { useMemo } from "react";
import { Loan } from "@/types";
import { toDateKey } from "@/utils/date";

export const WEEKDAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export interface CalendarDayItem {
  day: number | null;
  key: string;
  loans: Loan[];
}

/**
 * Custom hook to encapsulate calendar calculations, day padding, and loan-to-day mappings.
 * Extracts pure date and business logic out of the presentation component.
 */
export function useCalendarGrid(month: Date, calendarLoans: Loan[]) {
  const monthName = useMemo(() => {
    return month.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  }, [month]);

  const days = useMemo<CalendarDayItem[]>(() => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const firstWeekday = new Date(year, monthIndex, 1).getDay();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    const items: CalendarDayItem[] = [];

    // Leading null padding for weekday alignment
    for (let i = 0; i < firstWeekday; i++) {
      items.push({ day: null, key: `empty-${i}`, loans: [] });
    }

    // Days in current month with mapped loans
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = toDateKey(year, monthIndex, day);
      const loans = calendarLoans.filter((loan) => dateKey >= loan.start_date && dateKey <= loan.due_date);
      items.push({ day, key: `day-${day}`, loans });
    }

    return items;
  }, [month, calendarLoans]);

  return {
    monthName,
    weekdays: WEEKDAYS,
    days
  };
}
