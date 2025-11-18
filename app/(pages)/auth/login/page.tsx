"use client";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { api } from "@/services/api"; // import axios instance
import { useRouter } from "next/navigation"; // import router

export default function Login() {
  const router = useRouter(); // initialize router
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", { email, password });
      const data = res.data;

      if (res.status === 200) {
        // 🌟 Store userId in localStorage
        if (data.user && data.user.userId) {
          localStorage.setItem("userId", data.user.userId);
        }

        toast.success("Login successful! Redirecting...");
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        toast.error(data.error || "Invalid email or password");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || "Network error or server not reachable");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <div className="bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">Welcome Back</h2>

        <form onSubmit={login} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="w-full p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
            Login
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Don’t have an account?{" "}
          <a href="/auth/register" className="text-blue-600 font-semibold">Register</a>
        </p>
      </div>
    </div>
  );
}
