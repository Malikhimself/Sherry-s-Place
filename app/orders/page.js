import Link from "next/link";
import { Package, ChevronRight, Calendar, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getUserOrders } from "@/app/actions/orders";

export default async function OrdersPage() {
    const { success, orders, error } = await getUserOrders();

    if (error) {
        return (
            <div className="min-h-screen flex flex-col bg-cream">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                    <p className="text-gray-600">{error}</p>
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
                    <h1 className="text-3xl font-bold mb-8 text-primary-green flex items-center gap-3">
                        <Package size={32} />
                        My Orders
                    </h1>

                    {orders.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-primary-green/5 p-12 text-center">
                            <div className="w-20 h-20 bg-primary-green/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-green">
                                <Package size={40} />
                            </div>
                            <h2 className="text-xl font-bold text-text-dark mb-2">
                                No orders yet
                            </h2>
                            <p className="text-gray-600 mb-8">
                                You haven't placed any orders yet. Start shopping to fill your
                                kitchen with premium cookware.
                            </p>
                            <Link
                                href="/products"
                                className="inline-block bg-primary-green text-white px-8 py-3 rounded-full font-bold hover:bg-secondary-green transition-colors shadow-lg active:scale-95"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <Link
                                    key={order.id}
                                    href={`/orders/${order.id}`}
                                    className="block bg-white rounded-xl shadow-sm border border-primary-green/5 overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    <div className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                            <div>
                                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                                    <span className="font-medium text-text-dark">
                                                        Order #{order.id}
                                                    </span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={14} />
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${order.status === "delivered"
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
                                                    <span className="text-sm text-gray-500">
                                                        {order.items.length} items
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-primary-green">
                                                    ${order.total.toFixed(2)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-sm">
                                            <div className="flex -space-x-2 overflow-hidden">
                                                {order.items.slice(0, 3).map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500"
                                                        title={item.product.name}
                                                    >
                                                        {item.product.image ? (
                                                            <img
                                                                src={item.product.image}
                                                                alt={item.product.name}
                                                                className="h-full w-full object-cover rounded-full"
                                                            />
                                                        ) : (
                                                            item.product.name.charAt(0)
                                                        )}
                                                    </div>
                                                ))}
                                                {order.items.length > 3 && (
                                                    <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                                        +{order.items.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center text-primary-green font-medium group">
                                                View Details
                                                <ChevronRight
                                                    size={16}
                                                    className="ml-1 group-hover:translate-x-1 transition-transform"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
