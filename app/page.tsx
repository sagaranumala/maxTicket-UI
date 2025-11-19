"use client";
import Events from "./(pages)/components/Events";
import Protected from "./(pages)/components/Protected";
import { useAuth } from "@/app/providers/AuthProvider";

export default function EventsPage() {
  const { logout, user } = useAuth();

  return (
    <Protected>
      <div className="p-4">
        {/* Header with user info + logout */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Welcome, {user?.name || user?.email}</h2>

          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* Events Component */}
        <Events />
      </div>
    </Protected>
  );
}
