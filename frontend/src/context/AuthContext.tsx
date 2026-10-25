"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User } from "@/types";
import {
  authService,
  getStoredToken,
  setStoredToken,
  removeStoredToken,
  getStoredUser,
  setStoredUser
} from "@/services";

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
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      return getStoredUser();
    }
    return null;
  });
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return getStoredToken();
    }
    return null;
  });
  const [authChecking, setAuthChecking] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const u = getStoredUser();
      const t = getStoredToken();
      if (u && t) return false;
    }
    return true;
  });
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [demoAccounts, setDemoAccounts] = useState<User[]>([]);

  // Load user session on mount
  useEffect(() => {
    const cachedUser = getStoredUser();
    if (cachedUser) {
      setUser(cachedUser);
    }

    const savedToken = getStoredToken();
    if (savedToken) {
      setToken(savedToken);
      if (cachedUser) {
        setAuthChecking(false);
      }
      authService
        .getMe()
        .then((userData) => {
          if (userData) {
            setUser(userData);
            setStoredUser(userData);
          } else {
            removeStoredToken();
            setToken(null);
            setUser(null);
          }
        })
        .catch((err) => {
          // If status is 401 Unauthorized, token is definitely expired
          if (err && typeof err === "object" && "status" in err && err.status === 401) {
            removeStoredToken();
            setToken(null);
            setUser(null);
          } else if (!getStoredUser()) {
            // Only clear if we don't have a valid cached user
            removeStoredToken();
            setToken(null);
            setUser(null);
          }
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
      setStoredUser(data.user);
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
        // Sesuai alur: register -> login -> dashboard,
        // jangan langsung mengaktifkan sesi login di AuthContext
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
