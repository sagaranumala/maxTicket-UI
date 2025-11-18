"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";

interface ProtectedProps {
  children: React.ReactNode;
}

export default function Protected({ children }: ProtectedProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect if not logged in after loading
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login"); // Use replace to avoid back navigation issues
    }
  }, [loading, user, router]);

  // Loading screen while checking auth
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // Block access if no user
  if (!user) return null;

  // Render protected content
  return <>{children}</>;
}
