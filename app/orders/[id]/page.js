import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Package, Calendar, MapPin, CreditCard, Download } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getOrderById } from "@/app/actions/orders";

export default async function OrderDetailsPage({ params }) {
    const { id } = await params;
    const { success, order, error } = await getOrderById(id);

    if (error) {
        return (
            <div className="min-h-screen flex flex-col bg-cream">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                    <p className="text-gray-600">{error}</p>
                    <Link
                        href="/orders"
                        className="inline-block mt-4 text-primary-green hover:underline"
                    >
                        Back to Orders
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-cream">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <Link
                        href="/orders"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-green mb-6 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Orders
                    </Link>

                    <div className="bg-white rounded-xl shadow-sm border border-primary-green/5 overflow-hidden">
                        {/* Order Header */}
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-text-dark mb-2">
                                        Order #{order.id}
                                    </h1>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={16} />
                                            {new Date(order.createdAt).toLocaleDateString()} at{" "}
                                            {new Date(order.createdAt).toLocaleTimeString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Package size={16} />
                                            {order.items.length} items
                                        </span>
                                    </div>
                                    <div className="mt-4">
                                        <a
                                            href={`/api/invoices/${order.id}`}
                                            target="_blank"
                                            className="inline-flex items-center gap-2 text-sm font-medium text-primary-green hover:text-secondary-green border border-primary-green/20 px-3 py-1.5 rounded-lg hover:bg-primary-green/5 transition-colors"
                                        >
                                            <Download size={16} />
                                            Download Invoice
                                        </a>
                                    </div>
                                </div>
                                <div>
                                    <span
                                        className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide ${order.status === "delivered"
                                            ? "bg-green-100 text-green-700"
                                            : order.status === "shipped"
                                                ? "bg-blue-100 text-blue-700"
                                                : order.status === "processing"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-gray-100 text-gray-700"
                                            }`}
                                    >
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 grid md:grid-cols-3 gap-8">
                            {/* Order Items */}
                            <div className="md:col-span-2 space-y-6">
                                <h2 className="text-lg font-bold text-primary-green mb-4">
                                    Items
                                </h2>
                                <div className="space-y-4">
                                    {order.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex gap-4 py-4 border-b border-gray-100 last:border-0"
                                        >
                                            <div className="w-20 h-20 bg-cream/30 rounded-lg flex-shrink-0 flex items-center justify-center text-primary-green/40 text-xs relative overflow-hidden">
                                                {item.product.image ? (
                                                    <Image
                                                        src={item.product.image}
                                                        alt={item.product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    "No Image"
                                                )}
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-semibold text-text-dark">
                                                            {item.product.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-500">
                                                            Qty: {item.quantity}
                                                        </p>
                                                    </div>
                                                    <div className="font-bold text-text-dark">
                                                        ₦{(item.price * item.quantity).toFixed(2)}
                                                    </div>
                                                </div>
                                                <div className="text-xs text-gray-400 mt-1">
                                                    ₦{item.price.toFixed(2)} each
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Summary & Info */}
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-lg font-bold text-primary-green mb-4">
                                        Order Summary
                                    </h2>
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Subtotal</span>
                                            <span>₦{order.total.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Shipping</span>
                                            <span className="text-primary-green font-medium">
                                                Free
                                            </span>
                                        </div>
                                        <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg text-text-dark">
                                            <span>Total</span>
                                            <span>₦{order.total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-primary-green mb-4">
                                        Shipping Address
                                    </h2>
                                    <div className="flex gap-3 text-gray-600">
                                        <MapPin size={20} className="flex-shrink-0 mt-1" />
                                        <div>
                                            <p className="font-medium text-text-dark">
                                                {order.user?.name || "Customer"}
                                            </p>
                                            <p>123 Main Street</p>
                                            <p>New York, NY 10001</p>
                                            <p>United States</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-primary-green mb-4">
                                        Payment Method
                                    </h2>
                                    <div className="flex gap-3 text-gray-600">
                                        <CreditCard size={20} className="flex-shrink-0 mt-1" />
                                        <div>
                                            <p className="font-medium text-text-dark">
                                                Visa ending in 4242
                                            </p>
                                            <p className="text-sm">Expires 12/25</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
