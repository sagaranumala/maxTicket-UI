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

  // ✅ Verify user via backend /auth/verify using HTTP-only cookie
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await api.get("/auth/me", { withCredentials: true });
        if (res.status === 200 && res.data.user) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
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
