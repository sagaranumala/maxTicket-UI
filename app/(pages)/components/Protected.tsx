"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";

export default function Protected({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // ✅ Redirect if not logged in after loading
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
