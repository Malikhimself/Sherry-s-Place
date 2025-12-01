"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/app/actions/orders";
import { Save } from "lucide-react";

export default function StatusUpdateForm({ orderId, currentStatus }) {
    const [status, setStatus] = useState(currentStatus);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        
        try {
            const result = await updateOrderStatus(orderId, status);
            
            if (result.success) {
                setMessage("Status updated successfully!");
                // Optional: Refresh the page to update other UI elements if needed
                // window.location.reload(); 
            } else {
                setMessage("Error: " + (result.error || "Failed to update"));
            }
        } catch (error) {
            setMessage("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-primary-green/5 p-6">
            <h2 className="text-lg font-bold text-primary-green mb-4">Update Status</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green/20"
                    disabled={loading}
                >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary-green text-white py-3 rounded-lg font-bold hover:bg-secondary-green transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    <Save size={18} />
                    {loading ? "Updating..." : "Update Status"}
                </button>
                {message && (
                    <p className={`text-sm text-center font-medium ${message.includes("Error") ? "text-red-600" : "text-green-600"}`}>
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
}
