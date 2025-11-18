"use client";

import { useState } from "react";
import { createBooking } from "@/services/api";
import { useRouter } from "next/navigation";
import { BookingData } from "../type";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

    if (availableSeats <= 0) {
      toast.error("No seats available for this event");
      return;
    }

    const clampedSeats = Math.max(minSeats, Math.min(seats, maxSeats));

    // Get userId from localStorage
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.warning("Please login before booking tickets");
      router.push("/auth/login");
      return;
    }

    try {
      setLoading(true);
      await createBooking({
        eventId: event.eventId,
        seats: clampedSeats,
        phone,
        userId, // send userId
      } as BookingData);

      toast.success("Booking successful!");
      router.push("/");
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
      <form
        onSubmit={handleSubmit}
        className="space-y-6 max-w-md mx-auto p-6 bg-white rounded-xl shadow-md"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          {event.title}
        </h2>

        {/* Seats Selector */}
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={decrement}
            className="px-3 py-1 bg-gray-200 rounded-l-md hover:bg-gray-300 transition"
          >
            -
          </button>

          <input
            type="number"
            value={seats}
            onChange={handleChange}
            className="w-20 text-center border-t border-b border-gray-300 py-1 focus:outline-none focus:ring-2 focus:ring-green-400"
            min={minSeats}
            max={maxSeats}
          />

          <button
            type="button"
            onClick={increment}
            className="px-3 py-1 bg-gray-200 rounded-r-md hover:bg-gray-300 transition"
          >
            +
          </button>
        </div>

        <p className="text-sm text-gray-500 text-center">
          Available Seats: <span className="font-medium">{availableSeats}</span>{" "}
          | Max per booking: <span className="font-medium">{maxSeats}</span>
        </p>

        {/* Phone Input */}
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone (optional)"
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={availableSeats <= 0 || loading}
          className={`w-full font-semibold py-2 rounded-md transition ${
            availableSeats <= 0 || loading
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </form>
    </>
  );
}
