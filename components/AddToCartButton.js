"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function AddToCartButton({ product, type = "icon" }) {
    const { addToCart } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = (e) => {
        e.preventDefault(); // Prevent navigation if inside a Link
        addToCart(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    if (type === "full") {
        return (
            <button
                onClick={handleAddToCart}
                className="flex-1 bg-primary-green text-white py-4 rounded-full font-bold text-lg hover:bg-secondary-green transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
            >
                <ShoppingCart size={24} />
                {isAdded ? "Added to Cart!" : "Add to Cart"}
            </button>
        );
    }

    return (
        <button
            onClick={handleAddToCart}
            className={`p-2 rounded-full transition-all shadow-sm active:scale-95 ${isAdded
                    ? "bg-secondary-green text-white"
                    : "bg-primary-green text-white hover:bg-secondary-green"
                }`}
            title="Add to Cart"
        >
            <ShoppingCart size={20} />
        </button>
    );
}
