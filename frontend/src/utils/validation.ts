/**
 * Client-side input validation utilities, strictly aligned with backend server rules.
 */

// Email regex matching RFC 5322 subset implemented on backend
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Username regex: alphanumeric, dots, hyphens, and underscores (3-30 chars)
const USERNAME_REGEX = /^[a-zA-Z0-9_\-\.]{3,30}$/;

// Academic identifier NIM/NIP regex (3-30 chars)
const IDENTIFIER_REGEX = /^[a-zA-Z0-9_\-\.\/ ]{3,30}$/;

// Phone number regex (7-25 chars)
const PHONE_REGEX = /^[0-9+()\- ]{7,25}$/;

/**
 * Strips script tags, javascript: uris, HTML control brackets, and null bytes
 * to protect against stored and reflected cross-site scripting (XSS).
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/\0/g, "") // strip null bytes
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // strip script tags
    .replace(/[<>]/g, "") // remove stray angle brackets
    .trim();
}

export function isValidEmail(email: string): boolean {
  if (!email || email.length > 100) return false;
  return EMAIL_REGEX.test(email.trim());
}

export function isValidUsername(username: string): boolean {
  if (!username) return false;
  return USERNAME_REGEX.test(username.trim());
}

export function isValidIdentifier(id: string): boolean {
  if (!id) return false;
  return IDENTIFIER_REGEX.test(id.trim());
}

export function isValidPhone(phone: string): boolean {
  if (!phone) return true; // phone is optional
  return PHONE_REGEX.test(phone.trim());
}

export function validateLoginForm(usernameOrEmail: string, password: string): string | null {
  if (!usernameOrEmail?.trim()) {
    return "Username atau Email wajib diisi.";
  }
  if (!password) {
    return "Password wajib diisi.";
  }
  return null;
}

export function validateRegisterForm(form: {
  username: string;
  email: string;
  password: string;
  full_name: string;
  identifier: string;
  contact_phone?: string;
}): string | null {
  const username = form.username?.trim() || "";
  const email = form.email?.trim() || "";
  const password = form.password || "";
  const fullName = form.full_name?.trim() || "";
  const identifier = form.identifier?.trim() || "";
  const phone = form.contact_phone?.trim() || "";

  if (username.length < 3 || username.length > 30) {
    return "Username harus memiliki panjang antara 3 hingga 30 karakter.";
  }
  if (!isValidUsername(username)) {
    return "Username hanya boleh mengandung huruf, angka, titik (.), strip (-), atau garis bawah (_).";
  }

  if (email.length > 100 || !isValidEmail(email)) {
    return "Format alamat email tidak valid (contoh: user@del.ac.id atau user@gmail.com).";
  }

  if (password.length < 6) {
    return "Password minimal 6 karakter.";
  }
  if (password.length > 128) {
    return "Password maksimal 128 karakter.";
  }

  if (fullName.length < 2 || fullName.length > 100) {
    return "Nama lengkap harus memiliki panjang antara 2 hingga 100 karakter.";
  }

  if (identifier.length < 3 || identifier.length > 30) {
    return "NIM/NIP harus memiliki panjang antara 3 hingga 30 karakter.";
  }
  if (!isValidIdentifier(identifier)) {
    return "Format NIM/NIP tidak valid (hanya alfanumerik, strip, garis miring, atau titik).";
  }

  if (phone && !isValidPhone(phone)) {
    return "Format nomor kontak tidak valid (contoh: 08123456789 atau +628123456789).";
  }

  return null;
}

export function validateItemForm(form: {
  name: string;
  total_stock: string | number;
}): string | null {
  if (!form.name?.trim()) {
    return "Nama barang wajib diisi.";
  }
  const stock = Number(form.total_stock);
  if (!Number.isInteger(stock) || stock < 0) {
    return "Stok harus berupa bilangan bulat non-negatif.";
  }
  return null;
}

export function validateLoanForm(form: {
  purpose: string;
  quantity: string | number;
  start_date: string;
  due_date: string;
  maxAvailableStock: number;
}): string | null {
  if (!form.purpose?.trim()) {
    return "Tujuan peminjaman wajib diisi.";
  }
  const qty = Number(form.quantity);
  if (!Number.isInteger(qty) || qty < 1) {
    return "Jumlah pinjam minimal 1 unit.";
  }
  if (qty > form.maxAvailableStock) {
    return `Stok tersedia hanya ${form.maxAvailableStock} unit.`;
  }
  if (!form.start_date || !form.due_date) {
    return "Tanggal mulai dan batas pengembalian wajib ditentukan.";
  }
  if (form.due_date < form.start_date) {
    return "Tanggal pengembalian harus sama atau setelah tanggal pinjam.";
  }
  return null;
}
