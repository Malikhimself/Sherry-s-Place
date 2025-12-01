"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, LogOut, Package, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function UserMenu({ user }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    async function handleSignOut() {
        await signOut({ redirect: false });
        router.push("/");
        router.refresh();
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
                {user.image ? (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary-green">
                        <Image
                            src={user.image}
                            alt={user.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-10 h-10 rounded-full bg-primary-green text-white flex items-center justify-center font-semibold border-2 border-primary-green">
                        {user.name?.charAt(0).toUpperCase()}
                    </div>
                )}
                <span className="hidden md:block text-text-dark font-medium">
                    {user.name}
                </span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-text-dark">{user.name}</p>
                        <p className="text-xs text-text-dark truncate">{user.email}</p>
                    </div>

                    <div className="py-2">
                        <Link
                            href="/profile"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-text-dark hover:bg-cream transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <User size={18} />
                            Profile
                        </Link>

                        <Link
                            href="/orders"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-text-dark hover:bg-cream transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <Package size={18} />
                            My Orders
                        </Link>

                        {user.role === "admin" && (
                            <Link
                                href="/admin"
                                className="flex items-center gap-3 px-4 py-2 text-sm text-text-dark hover:bg-cream transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <Settings size={18} />
                                Admin Panel
                            </Link>
                        )}
                    </div>

                    <div className="border-t border-gray-100 pt-2">
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                        >
                            <LogOut size={18} />
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
