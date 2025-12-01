import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProducts } from "@/lib/products";

export default async function ProductsPage() {
    const products = await getProducts();

    return (
        <div className="min-h-screen flex flex-col bg-cream">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold mb-8 text-primary-green text-center">Our Collection</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}
