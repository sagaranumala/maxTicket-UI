import { BookingData } from "@/app/(pages)/type";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL; // e.g., "http://localhost:4000"

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ✅ include cookies in requests
});

// ------------------- EVENTS -------------------

// Get all events
export const getEvents = () => api.get("/events");

// Get single event by eventId
export const getByEventId = (eventId: string) => api.get(`/events/${eventId}`);

// Create a new event (Admin only)
export const createEvent = (event: {
  title: string;
  description?: string;
  location?: string;
  startAt: string;
  totalSeats: number;
}) => api.post("/events/create", event);

// Delete an event by eventId (Admin only)
export const deleteEvent = (eventId: string) => api.delete(`/events/${eventId}`);

// ------------------- BOOKINGS -------------------

// Create a new booking
export const createBooking = (booking: BookingData) =>
  api.post("/bookings", booking);

// Get all bookings (optional: admin)
export const getBookings = () => api.get("/bookings");

// Get bookings by user (optional)
export const getUserBookings = (userId: string) =>
  api.get(`/bookings/user/${userId}`);
