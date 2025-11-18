"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
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
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAdmin: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user data on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // First, try to get from localStorage for immediate UI
      const cached = localStorage.getItem("user");
      const cachedUser = cached ? JSON.parse(cached) : null;
      
      setUser(cachedUser); // Set cached user immediately

      // Then verify with backend
      const res = await api.get("/auth/me");
      
      if (res.status === 200 && res.data.user) {
        // Backend confirmed user is valid
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } else {
        // Backend says user is not valid
        setUser(null);
        localStorage.removeItem("user");
      }
    } catch (error) {
      // API call failed, keep cached user but mark as potentially stale
      console.warn("Auth verification failed, using cached data:", error);
      
      // If we have cached user, keep it but be aware it might be stale
      // If no cached user, clear everything
      const cached = localStorage.getItem("user");
      if (!cached) {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password }, { withCredentials: true });

      if (res.status === 200 && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        router.push("/"); // Redirect to home after successful login
      }
    } catch (error) {
      throw error; // Re-throw for the login form to handle
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/register", { name, email, password, phone });
      if (res.status === 201) {
        await login(email, password); // Auto-login after registration
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      setLoading(false);
      router.push("/auth/login");
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}