"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getEvents, createEvent, deleteEvent } from "@/services/api";
import { useAuth } from "@/app/providers/AuthProvider";
import CreateEventModal from "./createEventModal";


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

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const { isAdmin } = useAuth();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await getEvents();
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteEvent(eventId);
      setEvents(events.filter((e) => e.eventId !== eventId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete event");
    }
  };

  if (loading) return <div className="p-8 text-center text-lg">Loading events...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-16">
      <div className="container mx-auto px-6">

        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight animate-fade-in drop-shadow-lg">
            🎉 Upcoming Events
          </h1>

          {isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-green-500 text-white px-6 py-3 rounded-2xl shadow-lg hover:bg-green-600 transition text-lg font-semibold"
            >
              Create Event
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {events.map((event, index) => {
            const seatsLeft = event.totalSeats - (event.seatsBooked || 0);
            const isLimited = seatsLeft > 0 && seatsLeft <= 5;
            const isSoldOut = seatsLeft === 0;
            const seatPercent = (seatsLeft / event.totalSeats) * 100;

            const gradients = [
              "from-fuchsia-500 to-purple-600",
              "from-indigo-500 to-blue-500",
              "from-emerald-400 to-teal-500",
              "from-yellow-400 to-orange-500",
              "from-pink-400 to-red-500",
            ];
            const bgGradient = gradients[index % gradients.length];

            return (
              <div
                key={event.id}
                className={`relative rounded-3xl shadow-2xl transform transition-all duration-500 hover:-translate-y-3 hover:shadow-3xl p-6 flex flex-col justify-between border-l-4 border-white overflow-hidden bg-gradient-to-r ${bgGradient} text-white animate-slide-up`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {isSoldOut && (
                  <span className="absolute top-4 right-4 bg-black bg-opacity-70 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
                    SOLD OUT
                  </span>
                )}
                {isLimited && !isSoldOut && (
                  <span className="absolute top-4 right-4 bg-yellow-300 text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                    LIMITED
                  </span>
                )}

                <div className="mb-4 text-center">
                  <h2 className="text-3xl font-extrabold tracking-wide drop-shadow-lg transition-all duration-500">
                    {event.title}
                  </h2>
                  <p className="text-sm text-gray-100/90 mt-1">{new Date(event.startAt).toLocaleString()}</p>
                </div>

                <div className="flex-1">
                  <p className="mb-3 text-white/90 text-base leading-relaxed">{event.description}</p>
                  <p className="mb-2 text-sm font-medium tracking-wide">
                    📍 <span className="text-white font-semibold">{event.location}</span>
                  </p>
                  <p className="text-sm mb-3 font-medium">
                    🎫 Seats Left:{" "}
                    <span className={`font-bold ${seatsLeft === 0 ? "text-red-300" : isLimited ? "text-yellow-200" : "text-green-200"}`}>
                      {seatsLeft}
                    </span>
                  </p>

                  <div className="w-full bg-white/30 h-2 rounded-full overflow-hidden mb-4">
                    <div
                      className={`h-2 rounded-full ${seatsLeft === 0 ? "bg-red-300" : isLimited ? "bg-yellow-300" : "bg-green-300"}`}
                      style={{
                        width: "0%",
                        animation: `fillBar 1s ease forwards`,
                        animationDelay: `${index * 150 + 300}ms`,
                        "--final-width": `${seatPercent}%`,
                      } as React.CSSProperties}
                    />
                  </div>
                </div>

                <Link href={`/booking/${event.eventId}`}>
                  <button
                    disabled={isSoldOut}
                    className={`mt-4 w-full font-semibold px-4 py-3 rounded-2xl shadow-lg text-lg transition-transform duration-300 ${isSoldOut ? "bg-gray-700 cursor-not-allowed text-white" : "bg-white text-gray-900 hover:bg-white/90 hover:scale-105"}`}
                  >
                    {isSoldOut ? "Unavailable" : "Book Now"}
                  </button>
                </Link>

                {isAdmin && (
                  <button
                    onClick={() => handleDeleteEvent(event.eventId)}
                    className="mt-2 w-full font-semibold px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white shadow-lg transition"
                  >
                    Delete Event
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Event Modal */}
      <CreateEventModal
  show={showModal}
  onClose={() => setShowModal(false)}
  onCreate={async (data) => {
    // Use only the input type, ignore the returned Event type
    await createEvent({
      ...data
    });
    fetchEvents();
  }}
/>


      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 1s ease forwards; }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { opacity: 0; animation: slide-up 0.6s ease forwards; }

        @keyframes fillBar {
          from { width: 0%; }
          to { width: var(--final-width); }
        }
      `}</style>
    </div>
  );
}
