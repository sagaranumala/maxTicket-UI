"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";

export default function Protected({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();  // ⬅️ Use context only

  // Redirect if not logged in
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
