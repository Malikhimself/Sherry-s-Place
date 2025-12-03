import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProduct, getProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import AddToCartButton from "@/components/AddToCartButton";

export default async function ProductPage({ params }) {
    const { id } = await params;
    const product = await getProduct(id);
    const allProducts = await getProducts();

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col bg-cream">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-20 text-center">
                    <h1 className="text-3xl font-bold text-primary-green mb-4">Product Not Found</h1>
                    <Link href="/products" className="text-secondary-green hover:underline">
                        Back to Shop
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    // Filter related products (same category, exclude current)
    const relatedProducts = allProducts
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    return (
        <div className="min-h-screen flex flex-col bg-cream">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-12">
                <Link href="/products" className="inline-flex items-center text-gray-600 hover:text-primary-green mb-8 transition-colors">
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Products
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                    {/* Product Image */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-primary-green/5 flex items-center justify-center aspect-square">
                        {product.image ? (
                            <Image
                                src={product.image}
                                alt={product.name}
                                width={500}
                                height={500}
                                className="object-contain max-h-full"
                                priority
                            />
                        ) : (
                            <div className="text-gray-300 text-xl font-medium">No Image Available</div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col justify-center">
                        <span className="text-secondary-green font-medium mb-2">{product.category}</span>
                        <h1 className="text-4xl font-bold text-primary-green mb-4">{product.name}</h1>
                        <p className="text-2xl font-bold text-text-dark mb-6">₦{product.price.toFixed(2)}</p>

                        <div className="prose prose-lg text-gray-600 mb-8">
                            <p>{product.description}</p>
                        </div>

                        <div className="flex gap-4">
                            <AddToCartButton product={product} type="full" />
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-100 text-sm text-gray-500">
                            <p>Free shipping on orders over ₦50</p>
                            <p className="mt-2">30-day money-back guarantee</p>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="border-t border-primary-green/10 pt-16">
                        <h2 className="text-2xl font-bold text-primary-green mb-8">Related Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <ProductCard key={relatedProduct.id} product={relatedProduct} />
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
