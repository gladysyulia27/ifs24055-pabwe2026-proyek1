"use client";

import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Loan } from "@/types";
import { PageHeader } from "@/components/common/PageHeader";
import { toDateKey } from "@/utils/date";

const WEEKDAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

interface CalendarViewProps {
  month: Date;
  calendarLoans: Loan[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onBackToDashboard: () => void;
}

/** Leading `null`s pad the grid so day 1 lands on its weekday column. */
function getCalendarDays(month: Date): Array<number | null> {
  const firstWeekday = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  return [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
}

function CalendarDay({ day, loans }: { day: number; loans: Loan[] }) {
  return (
    <div className="calendar-day">
      <span className="day-number">{day}</span>
      <div className="day-events">
        {loans.map((loan) => (
          <div key={loan.id} className="calendar-event" title={`${loan.inventory_name} · ${loan.borrower_name}`}>
            <b>{loan.inventory_name}</b>
            <span>{loan.borrower_name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CalendarView({ month, calendarLoans, onPrevMonth, onNextMonth, onBackToDashboard }: CalendarViewProps) {
  const monthName = month.toLocaleDateString("id-ID", { month: "long", year: "numeric" });

  return (
    <>
      <PageHeader
        eyebrow="AGENDA PEMINJAMAN"
        title="Kalender Peminjaman Barang"
        description="Jadwal penggunaan inventori departemen oleh mahasiswa dan organisasi kampus."
        onBack={onBackToDashboard}
      />

      <div className="calendar-card">
        <div className="calendar-toolbar">
          <h2>{monthName}</h2>
          <div className="calendar-nav-btns">
            <button type="button" className="btn btn-secondary btn-small" onClick={onPrevMonth} aria-label="Bulan sebelumnya">
              <ArrowLeft size={14} />
            </button>
            <button type="button" className="btn btn-secondary btn-small" onClick={onNextMonth} aria-label="Bulan berikutnya">
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <div className="calendar-grid">
          {WEEKDAYS.map((weekday) => (
            <div key={weekday} className="calendar-weekday">
              {weekday}
            </div>
          ))}

          {getCalendarDays(month).map((day, index) => {
            if (day === null) return <div key={`empty-${index}`} className="calendar-day empty" />;
            const dateKey = toDateKey(month.getFullYear(), month.getMonth(), day);
            const loans = calendarLoans.filter((l) => dateKey >= l.start_date && dateKey <= l.due_date);
            return <CalendarDay key={day} day={day} loans={loans} />;
          })}
        </div>
      </div>
    </>
  );
}
