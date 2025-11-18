"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getByEventId } from "@/services/api";
import Link from "next/link";

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  startAt: string;
  totalSeats: number;
  seatsBooked?: number;
  eventId: string;
}

export default function EventDetails() {
  const params = useParams();
  const eventId = params?.eventId as string | undefined;
  console.log("EventDetails: eventId =", eventId);

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEvent = async () => {
    if (!eventId) {
      setLoading(false);
      setEvent(null);
      return;
    }

    setLoading(true);
    try {
      const res = await getByEventId(eventId);
      setEvent(res?.data || null);
    } catch (err) {
      console.error(err);
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  if (loading) return <div className="p-8 text-center text-lg">Loading event...</div>;
  if (!event) return <div className="p-8 text-center text-lg">No data found.</div>;

  const seatsLeft = event.totalSeats - (event.seatsBooked || 0);
  const isSoldOut = seatsLeft === 0;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const h = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${d} ${h}:${min}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-16">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">{event.title}</h1>
        <p className="text-gray-700 mb-2">📍 Location: {event.location}</p>
        <p className="text-gray-700 mb-2">🗓 Start: {formatDate(event.startAt)}</p>
        <p className="text-gray-700 mb-2">
          🎫 Seats Left: {seatsLeft} / {event.totalSeats} {isSoldOut && "(Sold Out)"}
        </p>
        <p className="text-gray-800 mb-6">{event.description}</p>

        <Link href={`/booking/${event.eventId}`}>
          <button
            disabled={isSoldOut}
            className={`px-6 py-3 rounded-lg font-semibold shadow-lg ${
              isSoldOut ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {isSoldOut ? "Sold Out" : "Book Now"}
          </button>
        </Link>

        <Link href="/mybookings">
          <button className="ml-4 px-6 py-3 rounded-lg font-semibold shadow-lg bg-gray-300 hover:bg-gray-400">
            Back to Events
          </button>
        </Link>
      </div>
    </div>
  );
}
