"use client";

import { createContext, useContext, ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";

interface User {
  userId: string;
  email: string;
  role?: "user" | "admin";
  name?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  isAdmin: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔹 LOGIN — sets user from backend response
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password }, { withCredentials: true });

      if (res.status === 200 && res.data.user) {
        setUser(res.data.user);   // <-- set here ONLY
      }
    } catch (err) {
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 REGISTER — sets user from backend response
  const register = async (name: string, email: string, password: string, phone?: string) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/register", { name, email, password, phone }, { withCredentials: true });

      if (res.status === 201 && res.data.user) {
        setUser(res.data.user);   // <-- set here ONLY
      }
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 LOGOUT — clears user
  const logout = async () => {
    setLoading(true);
    try {
      setUser(null);
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
