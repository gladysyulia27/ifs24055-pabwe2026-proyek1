import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { LoginCredentials } from "@/types";

describe("Authentication Form Components", () => {
  describe("LoginForm Component", () => {
    it("renders form fields and handles input changes", () => {
      const onChange = vi.fn();
      const onSubmit = vi.fn();
      const initialValues: LoginCredentials = { username_or_email: "", password: "" };

      render(
        <LoginForm
          values={initialValues}
          loading={false}
          onChange={onChange}
          onSubmit={onSubmit}
        />
      );

      expect(screen.getByLabelText(/username atau email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

      const usernameInput = screen.getByPlaceholderText(/andi_del/i);
      fireEvent.change(usernameInput, { target: { value: "ifs24055" } });

      expect(onChange).toHaveBeenCalledWith({ username_or_email: "ifs24055", password: "" });
    });

    it("triggers onSubmit when login form is submitted", () => {
      const onChange = vi.fn();
      const onSubmit = vi.fn();
      const values: LoginCredentials = { username_or_email: "ifs24055", password: "password123" };

      render(
        <LoginForm
          values={values}
          loading={false}
          onChange={onChange}
          onSubmit={onSubmit}
        />
      );

      const submitBtn = screen.getByRole("button", { name: /masuk ke sistem/i });
      fireEvent.click(submitBtn);

      expect(onSubmit).toHaveBeenCalledWith(values);
    });

    it("disables submit button and shows loading text during authentication", () => {
      render(
        <LoginForm
          values={{ username_or_email: "", password: "" }}
          loading={true}
          onChange={vi.fn()}
          onSubmit={vi.fn()}
        />
      );

      const submitBtn = screen.getByRole("button", { name: /memverifikasi/i });
      expect(submitBtn).toBeDisabled();
    });
  });

  describe("RegisterForm Component", () => {
    it("renders registration fields properly", () => {
      const onSubmit = vi.fn();
      render(<RegisterForm loading={false} onSubmit={onSubmit} />);

      expect(screen.getByPlaceholderText(/andi_pratama/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/andi@del.ac.id/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Andi Pratama Simanjuntak/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/11S21001/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/minimal 6 karakter/i)).toBeInTheDocument();
    });

    it("captures field inputs and submits payload", () => {
      const onSubmit = vi.fn();
      render(<RegisterForm loading={false} onSubmit={onSubmit} />);

      fireEvent.change(screen.getByPlaceholderText(/andi_pratama/i), {
        target: { value: "gladys27" }
      });
      fireEvent.change(screen.getByPlaceholderText(/andi@del.ac.id/i), {
        target: { value: "gladys@del.ac.id" }
      });
      fireEvent.change(screen.getByPlaceholderText(/Andi Pratama Simanjuntak/i), {
        target: { value: "Gladys Manurung" }
      });
      fireEvent.change(screen.getByPlaceholderText(/11S21001/i), {
        target: { value: "11422001" }
      });
      fireEvent.change(screen.getByPlaceholderText(/minimal 6 karakter/i), {
        target: { value: "secret123" }
      });

      const submitBtn = screen.getByRole("button", { name: /daftar akun mahasiswa/i });
      fireEvent.click(submitBtn);

      expect(onSubmit).toHaveBeenCalledWith({
        username: "gladys27",
        email: "gladys@del.ac.id",
        full_name: "Gladys Manurung",
        identifier: "11422001",
        password: "secret123",
        contact_phone: ""
      });
    });
  });
});
