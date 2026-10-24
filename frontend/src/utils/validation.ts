/**
 * Client-side input validation utilities
 */

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidIdentifier(id: string): boolean {
  // Del student NIM (e.g. 11S21001) or staff ID: at least 4 alphanumeric chars
  return /^[a-zA-Z0-9_\-\.]{4,20}$/.test(id.trim());
}

export function validateLoginForm(usernameOrEmail: string, password: string):string | null {
  if (!usernameOrEmail.trim()) return "Username atau Email wajib diisi.";
  if (!password) return "Password wajib diisi.";
  return null;
}

export function validateRegisterForm(form: {
  username: string;
  email: string;
  password: string;
  full_name: string;
  identifier: string;
}): string | null {
  if (!form.username.trim() || form.username.trim().length < 3) {
    return "Username minimal 3 karakter.";
  }
  if (!isValidEmail(form.email)) {
    return "Format alamat email tidak valid (contoh: user@gmail.com atau user@del.ac.id).";
  }
  if (!form.password || form.password.length < 6) {
    return "Password minimal 6 karakter.";
  }
  if (!form.full_name.trim() || form.full_name.trim().length < 2) {
    return "Nama lengkap wajib diisi minimal 2 karakter.";
  }
  if (!isValidIdentifier(form.identifier)) {
    return "NIM/NIP minimal 4 karakter alfanumerik.";
  }
  return null;
}

export function validateItemForm(form: {
  name: string;
  total_stock: string | number;
}): string | null {
  if (!form.name.trim()) return "Nama barang wajib diisi.";
  const stock = Number(form.total_stock);
  if (isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
    return "Stok total harus berupa bilangan bulat lebih besar atau sama dengan 0.";
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
  if (!form.purpose.trim()) return "Tujuan peminjaman wajib diisi.";
  const qty = Number(form.quantity);
  if (isNaN(qty) || qty <= 0 || !Number.isInteger(qty)) {
    return "Jumlah barang harus berupa bilangan bulat minimal 1 unit.";
  }
  if (qty > form.maxAvailableStock) {
    return `Jumlah peminjaman (${qty} unit) melebihi stok yang tersedia (${form.maxAvailableStock} unit).`;
  }
  if (!form.start_date || !form.due_date) {
    return "Tanggal mulai dan batas pengembalian wajib ditentukan.";
  }
  if (new Date(form.due_date) < new Date(form.start_date)) {
    return "Batas tanggal kembali tidak boleh lebih awal dari tanggal mulai peminjaman.";
  }
  return null;
}
