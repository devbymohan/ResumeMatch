import React, { createContext, useContext, useState, useEffect } from "react";
import { AppUser } from "../types";
import { MOCK_USER } from "../data/mock";

interface AuthCtx {
  user: AppUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  login: async () => false,
  register: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(() => {
    try {
      const s = localStorage.getItem("rm_user");
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });

  const login = async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 1000));
    if (email.includes("@") && password.length >= 6) {
      const u = { ...MOCK_USER, email };
      setUser(u);
      localStorage.setItem("rm_user", JSON.stringify(u));
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 1200));
    if (name && email.includes("@") && password.length >= 6) {
      const u = { ...MOCK_USER, name, email, plan: "free" as const };
      setUser(u);
      localStorage.setItem("rm_user", JSON.stringify(u));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("rm_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
