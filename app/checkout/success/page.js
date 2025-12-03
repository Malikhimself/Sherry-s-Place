"use client";

import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");

    return (
        <div className="min-h-screen flex flex-col bg-cream">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                    <CheckCircle size={48} />
                </div>
                <h1 className="text-3xl font-bold text-primary-green mb-4">Payment Successful!</h1>
                <p className="text-gray-600 mb-8 max-w-md">
                    Thank you for your purchase. Your order has been confirmed and will be shipped soon.
                </p>
                <div className="flex gap-4">
                    {orderId && (
                        <Link
                            href={`/orders/${orderId}`}
                            className="bg-primary-green text-white px-8 py-3 rounded-full font-bold hover:bg-secondary-green transition-colors shadow-lg active:scale-95"
                        >
                            View Order
                        </Link>
                    )}
                    <Link
                        href="/products"
                        className="bg-white border border-primary-green text-primary-green px-8 py-3 rounded-full font-bold hover:bg-green-50 transition-colors shadow-sm active:scale-95"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}
