"use client";

import { useState } from "react";
import { createBooking } from "@/services/api";
import { useRouter } from "next/navigation";
import { BookingData } from "../type";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/app/providers/AuthProvider"; // ✅ import context

interface Event {
  id?: number;
  title: string;
  totalSeats: number;
  seatsBooked?: number;
  eventId: string;
}

interface Props {
  event: Event;
}

export default function BookingForm({ event }: Props) {
  const router = useRouter();
  const { user } = useAuth(); // ✅ get user from context

  const totalSeats = Number(event.totalSeats) || 0;
  const seatsBooked = Number(event.seatsBooked) || 0;
  const availableSeats = Math.max(totalSeats - seatsBooked, 0);
  const maxSeats = Math.min(5, availableSeats); // max 5 per booking
  const minSeats = 1;

  const [seats, setSeats] = useState(minSeats);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const increment = () => setSeats((prev) => Math.min(prev + 1, maxSeats));
  const decrement = () => setSeats((prev) => Math.max(prev - 1, minSeats));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (isNaN(value)) return;
    setSeats(Math.max(minSeats, Math.min(value, maxSeats)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.warning("Please login before booking tickets");
      router.push("/auth/login");
      return;
    }

    if (availableSeats <= 0) {
      toast.error("No seats available for this event");
      return;
    }

    const clampedSeats = Math.max(minSeats, Math.min(seats, maxSeats));

    try {
      setLoading(true);
      await createBooking({
        eventId: event.eventId,
        seats: clampedSeats,
        phone,
        userId: user.userId, // ✅ get userId from context
      } as BookingData);

      toast.success("Booking successful!");
      router.push("/mybookings");
    } catch (err: any) {
      console.error("Booking failed:", err);
      toast.error(err.response?.data?.message || "Booking failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 to-green-50 p-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100"
        >
          <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
            {event.title}
          </h2>

          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-50 rounded-full border border-gray-200 shadow-inner px-3 py-1">
              <button
                type="button"
                onClick={decrement}
                className="px-4 py-2 bg-green-100 text-green-700 font-bold rounded-full hover:bg-green-200 transition"
              >
                -
              </button>

              <input
                type="number"
                value={seats}
                onChange={handleChange}
                className="w-24 text-center border-none bg-transparent text-lg font-medium focus:outline-none"
                min={minSeats}
                max={maxSeats}
              />

              <button
                type="button"
                onClick={increment}
                className="px-4 py-2 bg-green-100 text-green-700 font-bold rounded-full hover:bg-green-200 transition"
              >
                +
              </button>
            </div>

            <p className="text-sm text-gray-500">
              Available Seats: <span className="font-semibold text-gray-800">{availableSeats}</span> |
              Max per booking: <span className="font-semibold text-gray-800">{maxSeats}</span>
            </p>
          </div>

          <div>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone (optional)"
              className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-300 placeholder-gray-400 transition"
            />
          </div>

          <button
            type="submit"
            disabled={availableSeats <= 0 || loading}
            className={`w-full py-3 rounded-xl font-semibold transition ${
              availableSeats <= 0 || loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600 shadow-lg"
            }`}
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </>
  );
}
