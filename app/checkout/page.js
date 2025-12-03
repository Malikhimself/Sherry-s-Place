"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PaystackPaymentButton from "@/components/PaystackButton";
import { Loader2 } from "lucide-react";

export default function CheckoutPage() {
    const { cartItems, cartTotal, isLoaded, clearCart } = useCart();
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

    const shipping = 0; // Free shipping
    const total = cartTotal + shipping;

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin?callbackUrl=/checkout");
        }
    }, [status, router]);

    const handleSuccess = async (reference) => {
        setIsProcessing(true);
        try {
            const res = await fetch("/api/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    reference: reference.reference, // Paystack returns object {reference, message, status, trans, ...}
                    cartItems,
                    total
                }),
            });

            const data = await res.json();

            if (data.success) {
                clearCart();
                router.push(`/checkout/success?orderId=${data.orderId}`);
            } else {
                alert("Payment verification failed: " + data.error);
                setIsProcessing(false);
            }
        } catch (error) {
            console.error("Verification error:", error);
            alert("An error occurred while verifying payment.");
            setIsProcessing(false);
        }
    };

    const handleClose = () => {
        console.log("Payment closed");
    };

    if (status === "loading" || !isLoaded || isProcessing) {
        return (
            <div className="min-h-screen flex flex-col bg-cream">
                <Header />
                <main className="flex-grow flex flex-col items-center justify-center">
                    <Loader2 className="animate-spin text-primary-green mb-4" size={48} />
                    {isProcessing && <p className="text-gray-600">Verifying payment...</p>}
                </main>
                <Footer />
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col bg-cream">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
                    <h1 className="text-3xl font-bold text-primary-green mb-4">Your Cart is Empty</h1>
                    <p className="text-gray-600 mb-8">Add some items to your cart to proceed to checkout.</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-cream">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8 text-primary-green text-center">Checkout</h1>

                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Order Summary */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-green/5 h-fit">
                        <h2 className="text-xl font-bold mb-6 text-primary-green">Order Summary</h2>
                        <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                                            ) : "Img"}
                                        </div>
                                        <div>
                                            <p className="font-medium text-text-dark">{item.name}</p>
                                            <p className="text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <span className="font-medium">₦{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-100 pt-4 space-y-2">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>₦{cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span className="text-primary-green font-medium">Free</span>
                            </div>
                            <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-lg text-text-dark">
                                <span>Total</span>
                                <span>₦{total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-green/5">
                        <h2 className="text-xl font-bold mb-6 text-primary-green">Payment Details</h2>
                        <div className="space-y-6">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600 mb-1">Contact Email</p>
                                <p className="font-medium">{session?.user?.email}</p>
                            </div>

                            <PaystackPaymentButton
                                amount={total}
                                email={session?.user?.email}
                                onSuccess={handleSuccess}
                                onClose={handleClose}
                            />

                            <div className="text-center text-xs text-gray-500 mt-4">
                                <span className="flex items-center justify-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                    Secured by Paystack
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
