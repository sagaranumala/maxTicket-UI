"use client";

import { useState } from "react";

interface CreateEventModalProps {
    show: boolean;
    onClose: () => void;
    onCreate: (data: { title: string; description: string; location: string; totalSeats: number; startAt: string }) => Promise<void>;
}

export default function CreateEventModal({ show, onClose, onCreate }: CreateEventModalProps) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        totalSeats: "",
        startAt: "",
    });
    const [creating, setCreating] = useState(false);

    const handleSubmit = async () => {
        if (!formData.title || !formData.totalSeats || !formData.startAt) {
            alert("Please fill in all required fields");
            return;
        }

        setCreating(true);
        try {
            await onCreate({
                ...formData,
                totalSeats: Number(formData.totalSeats),
            });
            setFormData({ title: "", description: "", location: "", totalSeats: "", startAt: "" });
            onClose();
        } catch (err) {
            console.error(err);
            alert("Failed to create event");
        } finally {
            setCreating(false);
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-8 relative animate-slide-up">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Event</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1">Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Location</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Total Seats *</label>
                        <input
                            type="number"
                            value={formData.totalSeats}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    totalSeats: e.target.value, // always a string
                                })
                            }
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Start Date & Time *</label>
                        <input
                            type="datetime-local"
                            value={formData.startAt}
                            onChange={(e) => setFormData({ ...formData, startAt: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={creating}
                        className="px-6 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 font-semibold transition"
                    >
                        {creating ? "Creating..." : "Create"}
                    </button>
                </div>

            </div>

            <style jsx>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.4s ease forwards; }
      `}</style>
        </div>
    );
}
