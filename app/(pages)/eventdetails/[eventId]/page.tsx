"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getByEventId } from "@/services/api";
import Link from "next/link";
import { formatDate } from "@/app/utils/formatDate";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center py-16">
  <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 md:p-12">
    
    {/* Event Title */}
    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 text-center">
      {event.title}
    </h1>

    {/* Event Info */}
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 text-gray-700 font-medium text-lg">
      <p className="flex items-center gap-2">
        <span className="text-green-500 text-xl">📍</span> {event.location}
      </p>
      <p className="flex items-center gap-2">
        <span className="text-blue-500 text-xl">🗓</span> {formatDate(event.startAt)}
      </p>
      <p
        className={`flex items-center gap-2 font-semibold text-xl ${
          isSoldOut ? "text-red-500" : "text-green-600"
        }`}
      >
       <span className="text-black text-xl">Seats Left</span> - {seatsLeft}
      </p>
    </div>

    {/* Description */}
    <p className="text-gray-700 mb-8 leading-relaxed text-center md:text-left">
      {event.description}
    </p>

    {/* Buttons */}
    <div className="flex flex-col md:flex-row justify-center md:justify-start gap-4">
      <Link href={`/booking/${event.eventId}`}>
        <button
          disabled={isSoldOut}
          className={`px-8 py-3 rounded-lg font-semibold shadow-lg transition-colors duration-300 ${
            isSoldOut
              ? "bg-gray-400 cursor-not-allowed text-gray-200"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          {isSoldOut ? "Sold Out" : "Book Now"}
        </button>
      </Link>

      <Link href="/mybookings">
        <button className="px-8 py-3 rounded-lg font-semibold shadow-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors duration-300">
          Back to Events
        </button>
      </Link>
    </div>
  </div>
</div>

  );
}
