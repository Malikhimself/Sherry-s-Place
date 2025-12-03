import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-primary-green text-cream py-12 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div className="flex flex-col items-center">
                        <div className="max-w-xs w-full text-left">
                            <h3 className="text-2xl font-bold mb-4 text-cream">Sherry&apos;s Place</h3>
                            <p className="text-cream/80">
                                Premium kitchen cookwares and curated gifts for every occasion. Elevate your home with our exclusive collection.
                            </p>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="flex flex-col items-center">
                        <div className="w-fit text-left">
                            <h4 className="text-lg font-semibold mb-4 text-cream">Quick Links</h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/" className="text-cream/80 hover:text-cream transition-colors">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/products" className="text-cream/80 hover:text-cream transition-colors">
                                        Shop
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/about" className="text-cream/80 hover:text-cream transition-colors">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="text-cream/80 hover:text-cream transition-colors">
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Social */}
                    <div className="flex flex-col items-center">
                        <div className="w-fit text-left">
                            <h4 className="text-lg font-semibold mb-4 text-cream">Follow Us</h4>
                            <div className="flex gap-4">
                                <a href="#" className="text-cream/80 hover:text-cream transition-colors">
                                    <Facebook size={24} />
                                </a>
                                <a href="#" className="text-cream/80 hover:text-cream transition-colors">
                                    <Instagram size={24} />
                                </a>
                                <a href="#" className="text-cream/80 hover:text-cream transition-colors">
                                    <Twitter size={24} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-cream/20 mt-8 pt-8 text-center text-cream/60 text-sm">
                    &copy; {new Date().getFullYear()} Sherry&apos;s Place. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
