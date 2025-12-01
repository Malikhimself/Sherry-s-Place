import Link from "next/link";
import { Eye, Package, Calendar, User, ArrowLeft } from "lucide-react";
import { getOrders } from "@/lib/orders";

export default async function AdminOrdersPage() {
    const orders = await getOrders();

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin" className="text-primary-green hover:text-secondary-green transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-3xl font-bold text-primary-green">Manage Orders</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-primary-green/5 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-cream border-b border-primary-green/10">
                            <th className="p-4 font-semibold text-primary-green">Order ID</th>
                            <th className="p-4 font-semibold text-primary-green">Customer</th>
                            <th className="p-4 font-semibold text-primary-green">Date</th>
                            <th className="p-4 font-semibold text-primary-green">Status</th>
                            <th className="p-4 font-semibold text-primary-green">Total</th>
                            <th className="p-4 font-semibold text-primary-green text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                <td className="p-4 text-gray-500 font-medium">#{order.id}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-primary-green/10 flex items-center justify-center text-primary-green">
                                            <User size={14} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-text-dark">{order.user?.name || "Unknown"}</p>
                                            <p className="text-xs text-gray-500">{order.user?.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-gray-600 text-sm">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${order.status === "delivered" ? "bg-green-100 text-green-700" :
                                        order.status === "shipped" ? "bg-blue-100 text-blue-700" :
                                            order.status === "processing" ? "bg-yellow-100 text-yellow-700" :
                                                "bg-gray-100 text-gray-700"
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-4 font-bold text-text-dark">${order.total.toFixed(2)}</td>
                                <td className="p-4 text-right">
                                    <Link
                                        href={`/admin/orders/${order.id}`}
                                        className="inline-flex items-center justify-center w-8 h-8 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="View Details"
                                    >
                                        <Eye size={18} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-gray-500">
                                    No orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
