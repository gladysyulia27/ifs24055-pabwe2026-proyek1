"use client";

import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Loan } from "@/types";
import { PageHeader } from "@/components/common/PageHeader";
import { useCalendarGrid } from "@/hooks/useCalendarGrid";

interface CalendarViewProps {
  month: Date;
  calendarLoans: Loan[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onBackToDashboard: () => void;
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
  const { monthName, weekdays, days } = useCalendarGrid(month, calendarLoans);

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
          {weekdays.map((weekday) => (
            <div key={weekday} className="calendar-weekday">
              {weekday}
            </div>
          ))}

          {days.map((item) => {
            if (item.day === null) return <div key={item.key} className="calendar-day empty" />;
            return <CalendarDay key={item.key} day={item.day} loans={item.loans} />;
          })}
        </div>
      </div>
    </>
  );
}
