"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X, LogIn, UserPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import UserMenu from "./UserMenu";
import { useCart } from "@/context/CartContext";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { data: session, status } = useSession();
    const { cartCount } = useCart();

    return (
        <header className="sticky top-0 z-50 bg-cream shadow-sm border-b border-primary-green/10 backdrop-blur-md bg-opacity-90">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2">
                    <div className="relative w-14 h-14">
                        <Image
                            src="/Logo-cream.png"
                            alt="Sherry's Place Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="text-2xl font-bold text-primary-green tracking-tight">
                        Sherry&apos;s Place
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link
                        href="/"
                        className="text-text-dark hover:text-primary-green transition-colors font-medium"
                    >
                        Home
                    </Link>
                    <Link
                        href="/products"
                        className="text-text-dark hover:text-primary-green transition-colors font-medium"
                    >
                        Shop
                    </Link>
                    <Link
                        href="/about"
                        className="text-text-dark hover:text-primary-green transition-colors font-medium"
                    >
                        About
                    </Link>
                    <Link href="/cart" className="relative text-primary-green hover:text-secondary-green transition-colors">
                        <ShoppingCart size={24} />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-secondary-green text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Auth Section */}
                    {status === "loading" ? (
                        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                    ) : session?.user ? (
                        <UserMenu user={session.user} />
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link
                                href="/auth/signin"
                                className="flex items-center gap-2 text-primary-green hover:text-secondary-green transition-colors font-medium"
                            >
                                <LogIn size={20} />
                                Sign In
                            </Link>
                            <Link
                                href="/auth/signup"
                                className="flex items-center gap-2 bg-primary-green text-white px-4 py-2 rounded-lg hover:bg-secondary-green transition-all transform hover:scale-105"
                            >
                                <UserPlus size={20} />
                                Sign Up
                            </Link>
                        </div>
                    )}
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-primary-green"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden bg-cream border-t border-primary-green/10 absolute w-full left-0 top-full shadow-lg">
                    <nav className="flex flex-col p-4 gap-4">
                        <Link
                            href="/"
                            className="text-text-dark hover:text-primary-green font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            href="/products"
                            className="text-text-dark hover:text-primary-green font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Shop
                        </Link>
                        <Link
                            href="/about"
                            className="text-text-dark hover:text-primary-green font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            About
                        </Link>
                        <Link
                            href="/cart"
                            className="flex items-center gap-2 text-primary-green font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <ShoppingCart size={20} />
                            Cart (0)
                        </Link>

                        {/* Mobile Auth Section */}
                        <div className="border-t border-primary-green/10 pt-4 mt-2">
                            {status === "loading" ? (
                                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                            ) : session?.user ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 pb-3 border-b border-primary-green/10">
                                        {session.user.image ? (
                                            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary-green">
                                                <Image
                                                    src={session.user.image}
                                                    alt={session.user.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-primary-green text-white flex items-center justify-center font-semibold">
                                                {session.user.name?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-semibold text-text-dark">{session.user.name}</p>
                                            <p className="text-xs text-text-light">{session.user.email}</p>
                                        </div>
                                    </div>
                                    <Link
                                        href="/profile"
                                        className="block text-text-dark hover:text-primary-green font-medium"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Profile
                                    </Link>
                                    <Link
                                        href="/orders"
                                        className="block text-text-dark hover:text-primary-green font-medium"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        My Orders
                                    </Link>
                                    {session.user.role === "admin" && (
                                        <Link
                                            href="/admin"
                                            className="block text-text-dark hover:text-primary-green font-medium"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Admin Panel
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <Link
                                        href="/auth/signin"
                                        className="flex items-center justify-center gap-2 text-primary-green border-2 border-primary-green px-4 py-2 rounded-lg hover:bg-primary-green hover:text-white transition-all font-medium"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <LogIn size={20} />
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/auth/signup"
                                        className="flex items-center justify-center gap-2 bg-primary-green text-white px-4 py-2 rounded-lg hover:bg-secondary-green transition-all font-medium"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <UserPlus size={20} />
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}

