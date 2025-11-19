"use client";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { api } from "@/services/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/register", form, { withCredentials: true });

      if (res.status === 201) {
        toast.success("Registration successful! Redirecting...");
        router.push("/"); 
      } else {
        toast.error(res.data.error || "Registration failed");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-200 to-pink-200">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <div className="bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-3xl font-bold text-center mb-6 text-purple-600">Create Account</h2>

        <form onSubmit={register} className="space-y-4">
          {Object.keys(form).map((key) => (
            <input
              key={key}
              type={key === "password" ? "password" : "text"}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none"
              value={(form as any)[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              required
            />
          ))}

          <button
            type="submit"
            className={`w-full p-3 rounded-xl text-white transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
            }`}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* ✅ Improved Login Link */}
        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-purple-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
