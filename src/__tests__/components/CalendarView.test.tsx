import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { CalendarView } from "@/components/views/CalendarView";
import { Loan } from "@/types";

const mockLoans: Loan[] = [
  {
    id: 1,
    inventory_id: 10,
    inventory_name: "Proyektor Epson EB-X500",
    department_name: "DESARPRAS",
    borrower_name: "Gladys Manurung",
    borrower_id: "11422001",
    borrower_contact: "08123456789",
    organization: "BEM IT Del",
    purpose: "Seminar Teknologi",
    quantity: 1,
    start_date: "2026-10-15",
    due_date: "2026-10-18",
    status: "Disetujui",
    return_proof_url: "",
    created_at: "2026-10-14T10:00:00Z"
  },
  {
    id: 2,
    inventory_id: 11,
    inventory_name: "Sound System Portable",
    department_name: "DESARPRAS",
    borrower_name: "Rio Silalahi",
    borrower_id: "11422002",
    borrower_contact: "08123456780",
    organization: "HIMASTI",
    purpose: "Malam Keakraban",
    quantity: 2,
    start_date: "2026-10-20",
    due_date: "2026-10-20",
    status: "Disetujui",
    return_proof_url: "",
    created_at: "2026-10-19T10:00:00Z"
  }
];

describe("CalendarView Component (Complex UI)", () => {
  const month = new Date(2026, 9, 1); // Oktober 2026
  const onPrevMonth = vi.fn();
  const onNextMonth = vi.fn();
  const onBackToDashboard = vi.fn();

  it("renders calendar header, month title, and weekday labels", () => {
    render(
      <CalendarView
        month={month}
        calendarLoans={mockLoans}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
        onBackToDashboard={onBackToDashboard}
      />
    );

    expect(screen.getByText("Kalender Peminjaman Barang")).toBeInTheDocument();
    expect(screen.getByText(/Oktober 2026/i)).toBeInTheDocument();
    expect(screen.getByText("Sen")).toBeInTheDocument();
    expect(screen.getByText("Min")).toBeInTheDocument();
    expect(screen.getByText("Sab")).toBeInTheDocument();
  });

  it("renders scheduled loan events on the calendar dates", () => {
    render(
      <CalendarView
        month={month}
        calendarLoans={mockLoans}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
        onBackToDashboard={onBackToDashboard}
      />
    );

    // Event on date 15
    const events = screen.getAllByText("Proyektor Epson EB-X500");
    expect(events.length).toBeGreaterThan(0);
    expect(screen.getByText("Sound System Portable")).toBeInTheDocument();
  });

  it("triggers navigation callbacks when next and prev buttons are clicked", () => {
    render(
      <CalendarView
        month={month}
        calendarLoans={mockLoans}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
        onBackToDashboard={onBackToDashboard}
      />
    );

    const prevBtn = screen.getByLabelText("Bulan sebelumnya");
    const nextBtn = screen.getByLabelText("Bulan berikutnya");

    fireEvent.click(prevBtn);
    expect(onPrevMonth).toHaveBeenCalledTimes(1);

    fireEvent.click(nextBtn);
    expect(onNextMonth).toHaveBeenCalledTimes(1);
  });
});
