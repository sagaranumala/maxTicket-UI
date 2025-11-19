"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";

interface User {
  userId: string;
  email: string;
  role?: "user" | "admin";
  name?: string;
  phone?: string;
}

export default function Protected({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Verify user via backend /auth/me using HTTP-only cookie
  useEffect(() => {
    const verifyUser = async () => {
      console.log("[Protected] 🔹 Verifying user via /auth/me...");
      try {
        const res = await api.get("/auth/me", { withCredentials: true });
        if (res.status === 200 && res.data.user) {
          console.log("[Protected] 🔹 User verified:", res.data.user);
          setUser(res.data.user);
        } else {
          console.warn("[Protected] ⚠️ No valid user returned.");
          setUser(null);
        }
      } catch (err) {
        console.error("[Protected] ❌ /auth/me failed:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      console.warn("[Protected] ⚠️ User not logged in. Redirecting...");
      router.replace("/auth/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) return null; // wait for redirect

  return <>{children}</>;
}
