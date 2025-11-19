"use client";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { api } from "@/services/api";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password }, { withCredentials: true });

      if (res.status === 200 && res.data.user) {
        toast.success("Login successful! Redirecting...");
        setTimeout(() => router.push("/"), 1000);
      } else {
        // Show backend error message
        toast.error(res.data?.error || "Login failed");
      }
    } catch (err: any) {
      // ✅ Handle network errors & backend 400/401
      if (err.response && err.response.data && err.response.data.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("Network error or server not reachable");
      }
      console.error("[Login] Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-100">
      <ToastContainer position="top-right" autoClose={3000} />
      <form onSubmit={login} className="bg-white p-8 rounded shadow w-96 space-y-4">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
