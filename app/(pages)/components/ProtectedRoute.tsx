"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import axios from "axios";

interface Props {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/auth/verify", { withCredentials: true }) // server endpoint to verify cookie
      .then(() => {
        setLoading(false); // user is authenticated
      })
      .catch(() => {
        router.push("auth/login"); // redirect to login if unauthenticated
      });
  }, [router]);

  if (loading) return <div className="p-4 text-center">Checking authentication...</div>;

  return <>{children}</>;
}
