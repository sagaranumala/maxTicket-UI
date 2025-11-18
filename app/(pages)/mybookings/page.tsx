"use client";

import { useEffect, useState } from "react";
import { getUserBookings } from "@/services/api";
import { useAuth } from "@/app/providers/AuthProvider";
import Link from "next/link";
import { formatDate } from "@/app/utils/formatDate";

interface Booking {
    id: number;
    userId: string;
    eventId: string;
    seats: number;
    phone?: string;
    createdAt: string;
    eventTitle?: string;
    eventStartAt?: string;
    eventLocation?: string;
}

export default function MyBookings() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchBookings = async () => {
            setLoading(true);
            try {
                const res = await getUserBookings(user.userId);
                console.log("User bookings fetched:", res.data);
                setBookings(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user]);

    if (loading) return <div className="p-8 text-center text-lg">Loading your bookings...</div>;
    if (!bookings.length) return <div className="p-8 text-center text-lg">You have no bookings yet.</div>;

    return (
        <div className="min-h-screen bg-gray-100 py-16">
            <div className="container mx-auto px-6">
                <h1 className="text-4xl font-bold mb-8 text-gray-900">🎫 My Bookings</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between">
                            <h2 className="text-2xl font-bold mb-2">{booking.eventTitle || "Event"}</h2>
                            <p className="text-gray-700 mb-1">📍 {booking.eventLocation || "Unknown location"}</p>
                            <p className="text-gray-700 mb-1">
                                🗓 {booking.eventStartAt ? new Date(booking.eventStartAt).toLocaleString() : "-"}
                            </p>
                            <p className="text-gray-700 mb-1">🎫 Seats booked: {booking.seats}</p>
                            <p className="text-gray-500 text-sm mt-2">
                                Booked on: {formatDate(booking.createdAt)}
                            </p>


                            <Link href={`/eventdetails/${booking.eventId}`}>
                                <button className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg shadow hover:bg-green-600 transition">
                                    View Event
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
