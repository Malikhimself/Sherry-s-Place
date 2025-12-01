import Link from "next/link";
import { ArrowLeft, Package, Calendar, MapPin, CreditCard, Save } from "lucide-react";
import { getOrderById, updateOrderStatus } from "@/app/actions/orders";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import StatusUpdateForm from "./StatusUpdateForm";

export default async function AdminOrderDetailsPage({ params }) {
    const { id } = await params;
    const { success, order, error } = await getOrderById(id);

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                <p className="text-gray-600">{error}</p>
                <Link href="/admin/orders" className="inline-block mt-4 text-primary-green hover:underline">
                    Back to Orders
                </Link>
            </div>
        );
    }



    return (
        <div className="container mx-auto px-4 py-12">
            <Link href="/admin/orders" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-green mb-6 transition-colors">
                <ArrowLeft size={20} />
                Back to Orders
            </Link>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-primary-green/5 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-text-dark">Order #{order.id}</h1>
                            <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide ${order.status === "delivered" ? "bg-green-100 text-green-700" :
                                order.status === "shipped" ? "bg-blue-100 text-blue-700" :
                                    order.status === "processing" ? "bg-yellow-100 text-yellow-700" :
                                        "bg-gray-100 text-gray-700"
                                }`}>
                                {order.status}
                            </span>
                        </div>

                        <div className="p-6">
                            <h2 className="text-lg font-bold text-primary-green mb-4">Items</h2>
                            <div className="space-y-4">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
                                        <div className="w-16 h-16 bg-cream/30 rounded-lg flex-shrink-0 flex items-center justify-center text-primary-green/40 text-xs relative overflow-hidden">
                                            {item.product.image ? (
                                                <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                                            ) : "No Image"}
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold text-text-dark">{item.product.name}</h3>
                                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                </div>
                                                <div className="font-bold text-text-dark">${(item.price * item.quantity).toFixed(2)}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status Update */}
                    <StatusUpdateForm orderId={order.id} currentStatus={order.status} />

                    {/* Customer Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-primary-green/5 p-6">
                        <h2 className="text-lg font-bold text-primary-green mb-4">Customer</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">Name</p>
                                <p className="font-medium text-text-dark">{order.user?.name || "Unknown"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium text-text-dark">{order.user?.email || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Joined</p>
                                <p className="font-medium text-text-dark">{order.user?.joinedAt ? new Date(order.user.joinedAt).toLocaleDateString() : "N/A"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white rounded-xl shadow-sm border border-primary-green/5 p-6">
                        <h2 className="text-lg font-bold text-primary-green mb-4">Summary</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>${order.total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span className="text-primary-green font-medium">Free</span>
                            </div>
                            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg text-text-dark">
                                <span>Total</span>
                                <span>${order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
