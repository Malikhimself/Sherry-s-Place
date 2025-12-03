"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2, ArrowRight, ShoppingBag, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/app/actions/orders";

export default function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart, isLoaded } = useCart();
    const { data: session } = useSession();
    const router = useRouter();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const shipping = 0; // Free shipping
    const total = cartTotal + shipping;

    async function handleCheckout() {
        if (!session) {
            router.push("/auth/signin?callbackUrl=/cart");
            return;
        }

        router.push("/checkout");
    }

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex flex-col bg-cream">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <Loader2 className="animate-spin text-primary-green" size={48} />
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
                    <div className="w-24 h-24 bg-primary-green/10 rounded-full flex items-center justify-center mb-6 text-primary-green">
                        <ShoppingBag size={48} />
                    </div>
                    <h1 className="text-3xl font-bold text-primary-green mb-4">Your Cart is Empty</h1>
                    <p className="text-gray-600 mb-8 max-w-md">
                        Looks like you haven't added anything to your cart yet. Explore our collection of premium kitchenware.
                    </p>
                    <Link
                        href="/products"
                        className="bg-primary-green text-white px-8 py-3 rounded-full font-bold hover:bg-secondary-green transition-colors shadow-lg active:scale-95"
                    >
                        Start Shopping
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
                <h1 className="text-3xl font-bold mb-8 text-primary-green">Your Cart</h1>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Cart Items */}
                    <div className="flex-grow">
                        <div className="bg-white rounded-xl shadow-sm border border-primary-green/5 overflow-hidden">
                            <div className="p-6 space-y-6">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
                                        <div className="w-24 h-24 bg-cream/30 rounded-lg flex-shrink-0 flex items-center justify-center text-primary-green/40 text-xs relative overflow-hidden">
                                            {item.image ? (
                                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            ) : (
                                                "No Image"
                                            )}
                                        </div>

                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-semibold text-lg text-text-dark">{item.name}</h3>
                                                <span className="font-bold text-primary-green">₦{(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                            <div className="text-gray-500 text-sm mb-4">₦{item.price.toFixed(2)} each</div>

                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center border border-gray-200 rounded-lg">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="px-3 py-1 hover:bg-gray-50 text-gray-600 transition-colors"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-3 py-1 font-medium text-text-dark">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="px-3 py-1 hover:bg-gray-50 text-gray-600 transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link href="/products" className="text-gray-600 hover:text-primary-green font-medium flex items-center gap-2 transition-colors">
                                <ArrowRight size={18} className="rotate-180" />
                                Continue Shopping
                            </Link>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-96 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm border border-primary-green/5 p-6 sticky top-24">
                            <h2 className="text-xl font-bold mb-6 text-primary-green">Order Summary</h2>

                            <div className="space-y-4 mb-6">
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

                            <button
                                onClick={handleCheckout}
                                disabled={isCheckingOut}
                                className="w-full bg-primary-green text-white py-3 rounded-full font-semibold hover:bg-secondary-green transition-colors flex items-center justify-center gap-2 shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isCheckingOut ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Checkout
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>

                            <div className="mt-4 text-center text-xs text-gray-500">
                                Secure Checkout powered by Stripe
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
