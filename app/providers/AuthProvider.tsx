"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";
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
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  isAdmin: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Verify session on mount using HTTP-only cookie
  useEffect(() => {
    const verifyUser = async () => {
      console.log("[AuthProvider] 🔹 Verifying user via /auth/me...");
      try {
        const res = await api.get("/auth/me", { withCredentials: true });
        if (res.status === 200 && res.data.user) {
          console.log("[AuthProvider] 🔹 User verified:", res.data.user);
          setUser(res.data.user);
        } else {
          console.warn("[AuthProvider] ⚠️ No valid user found.");
          setUser(null);
        }
      } catch (err) {
        console.error("[AuthProvider] ❌ /auth/me failed:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post(
        "/auth/login",
        { email, password },
        { withCredentials: true } // ✅ must include cookie from server
      );
      if (res.status === 200 && res.data.user) {
        console.log("[AuthProvider] 🔹 Login success:", res.data.user);
        setUser(res.data.user);
      }
    } catch (err) {
      console.error("[AuthProvider] ❌ Login failed:", err);
      setUser(null);
      throw err; // bubble up for UI
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/register", { name, email, password, phone });
      if (res.status === 201) {
        await login(email, password); // auto-login
      }
    } catch (err) {
      console.error("[AuthProvider] ❌ Registration failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      console.log("[AuthProvider] 🔹 Logged out successfully");
      setUser(null);
      router.push("/auth/login");
    } catch (err) {
      console.error("[AuthProvider] ❌ Logout failed:", err);
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
