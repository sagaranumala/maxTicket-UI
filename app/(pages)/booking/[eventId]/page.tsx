import BookingForm from "../../components/BookingForm";
import { getByEventId } from "@/services/api";

interface Event {
  id?: number;
  title: string;
  totalSeats: number;
  seatsBooked?: number;
  eventId: string;
}

interface Params {
  eventId: string;
}

// Server Component
export default async function BookEventPage({ params }: { params: Promise<Params> }) {
  // Wait for the params promise to resolve
  const { eventId } = await params;

  // Fetch the event from API
  const url = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${url}/events/${eventId}`);
  const event = await res.json();

  if (!event) {
    return <div className="p-4 text-red-500">Event not found!</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Book: {event.title}</h1>
      {/* Pass the fully-fetched event to client component */}
      <BookingForm event={event} />
    </div>
  );
}
