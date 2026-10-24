"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User } from "@/types";
import { authService, getStoredToken, setStoredToken, removeStoredToken } from "@/services";

interface AuthContextType {
  user: User | null;
  token: string | null;
  authChecking: boolean;
  authLoading: boolean;
  demoAccounts: User[];
  login: (usernameOrEmail: string, password: string) => Promise<User>;
  register: (payload: {
    username: string;
    email: string;
    password: string;
    full_name: string;
    identifier: string;
    contact_phone?: string;
  }) => Promise<User>;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [demoAccounts, setDemoAccounts] = useState<User[]>([]);

  // Load user session on mount
  useEffect(() => {
    const savedToken = getStoredToken();
    if (savedToken) {
      setToken(savedToken);
      authService
        .getMe()
        .then((userData) => {
          if (userData) setUser(userData);
          else removeStoredToken();
        })
        .catch(() => {
          removeStoredToken();
          setToken(null);
          setUser(null);
        })
        .finally(() => {
          setAuthChecking(false);
        });
    } else {
      setAuthChecking(false);
    }

    // Load demo accounts
    authService
      .getDemoAccounts()
      .then((accs) => {
        if (Array.isArray(accs)) setDemoAccounts(accs);
      })
      .catch(() => {});
  }, []);

  const login = useCallback(async (usernameOrEmail: string, password: string): Promise<User> => {
    setAuthLoading(true);
    try {
      const data = await authService.login({ username_or_email: usernameOrEmail, password });
      setStoredToken(data.token);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const register = useCallback(
    async (payload: {
      username: string;
      email: string;
      password: string;
      full_name: string;
      identifier: string;
      contact_phone?: string;
    }): Promise<User> => {
      setAuthLoading(true);
      try {
        const data = await authService.register({
          ...payload,
          role: "mahasiswa",
          department_id: null
        });
        setStoredToken(data.token);
        setToken(data.token);
        setUser(data.user);
        return data.user;
      } finally {
        setAuthLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await authService.logout();
    } catch {
      // Continue client logout even if backend failed
    } finally {
      removeStoredToken();
      setToken(null);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        authChecking,
        authLoading,
        demoAccounts,
        login,
        register,
        logout,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return ctx;
}
