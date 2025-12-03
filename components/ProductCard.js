import Link from "next/link";
import Image from "next/image";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard({ product }) {
    return (
        <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-primary-green/5">
            <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-cream/30">
                {product.image ? (
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary-green/40">
                        No Image
                    </div>
                )}
            </Link>

            <div className="p-4">
                <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-lg text-text-dark mb-1 hover:text-primary-green transition-colors line-clamp-1">
                        {product.name}
                    </h3>
                </Link>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between mt-auto">
                    <span className="text-xl font-bold text-primary-green">
                        ₦{product.price.toFixed(2)}
                    </span>
                    <AddToCartButton product={product} />
                </div>
            </div>
        </div>
    );
}
