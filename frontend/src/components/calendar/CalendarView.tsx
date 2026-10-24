"use client";

import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Loan } from "@/types";

interface CalendarViewProps {
  month: Date;
  calendarLoans: Loan[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onBackToDashboard: () => void;
}

export function CalendarView({
  month,
  calendarLoans,
  onPrevMonth,
  onNextMonth,
  onBackToDashboard
}: CalendarViewProps) {
  const monthName = month.toLocaleDateString("id-ID", { month: "long", year: "numeric" });

  const getCalendarDays = () => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
    const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    return [...Array(first).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)];
  };

  const weekdays = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const days = getCalendarDays();

  return (
    <>
      <div className="page-heading">
        <div className="page-heading-action">
          <button type="button" className="page-back-btn" onClick={onBackToDashboard} title="Kembali ke Dashboard">
            <ArrowLeft size={15} /> Kembali ke Dashboard
          </button>
          <span className="eyebrow">AGENDA PEMINJAMAN</span>
        </div>
        <h1>Kalender Peminjaman Barang</h1>
        <p>Jadwal penggunaan inventori departemen oleh mahasiswa dan organisasi kampus.</p>
      </div>

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
          {weekdays.map((w) => (
            <div key={w} className="calendar-weekday">
              {w}
            </div>
          ))}

          {days.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="calendar-day empty" />;
            }
            const dateStr = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const events = calendarLoans.filter((l) => dateStr >= l.start_date && dateStr <= l.due_date);

            return (
              <div key={day} className="calendar-day">
                <span className="day-number">{day}</span>
                <div className="day-events">
                  {events.map((e) => (
                    <div key={e.id} className="calendar-event" title={`${e.inventory_name} · ${e.borrower_name}`}>
                      <b>{e.inventory_name}</b>
                      <span>{e.borrower_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
