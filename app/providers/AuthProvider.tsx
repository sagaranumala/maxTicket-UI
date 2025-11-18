"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api"; // Axios instance with withCredentials: true

// ----------------- Types -----------------
interface User {
  userId: string;
  id?: number;
  name?: string;
  email: string;
  role?: "user" | "admin";
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

// ----------------- Context -----------------
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAdmin: false,
});

// ----------------- Provider -----------------
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ----------------- Fetch User -----------------
  const fetchUser = async () => {
    try {
      console.log("🔵 Fetching user from /auth/me...");
      const res = await api.get("/auth/me");
      console.log("🟢 /auth/me response:", res.status, res.data);

      if (res.status === 200 && res.data.user) {
        setUser(res.data.user);
        console.log("✅ User set:", res.data.user);
      } else {
        setUser(null);
        console.log("⚠️ No user returned from /auth/me");
      }
    } catch (err: any) {
      console.log("🔥 /auth/me error:", err.response?.data || err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // ----------------- Login -----------------
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log("🔵 Logging in:", email);
      const res = await api.post(
        "/auth/login",
        { email, password },
        { withCredentials: true }
      );

      console.log("🟢 Login response:", res.status, res.data);

      if (res.status === 200 && res.data.user) {
        setUser(res.data.user);
        router.push("/");
      }
    } catch (err: any) {
      console.log("🔥 Login error:", err.response?.data || err.message);
      setUser(null);
      throw err; // optional: to show toast in login form
    } finally {
      setLoading(false);
    }
  };

  // ----------------- Register -----------------
  const register = async (name: string, email: string, password: string, phone?: string) => {
    setLoading(true);
    try {
      console.log("🔵 Registering user:", email);
      const res = await api.post("/auth/register", { name, email, password, phone });
      console.log("🟢 Register response:", res.status, res.data);

      if (res.status === 201 && res.data.userId) {
        // Auto-login after registration
        await login(email, password);
      }
    } catch (err: any) {
      console.log("🔥 Register error:", err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ----------------- Logout -----------------
  const logout = async () => {
    try {
      console.log("🔴 Logging out...");
      await api.post("/auth/logout", {}, { withCredentials: true });
      console.log("✅ Logged out on server");
    } catch (err) {
      console.log("⚠️ Logout error:", err);
    } finally {
      setUser(null);
      router.push("/auth/login");
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

// ----------------- Hook -----------------
export function useAuth() {
  return useContext(AuthContext);
}
