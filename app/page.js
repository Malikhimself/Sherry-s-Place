import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProducts } from "@/lib/products";

export default async function Home() {
  const products = await getProducts();
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />

      <main className="flex-grow">
        <div className="flex flex-col gap-12 pb-12">
          {/* Hero Section */}
          <section className="relative h-[600px] flex items-center justify-center text-cream overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src="/hero-bg-v2.png"
                alt="Sherry's Place Kitchen"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/40"></div> {/* Overlay */}
            </div>

            <div className="container mx-auto px-4 text-center z-10 relative">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
                Sherry&apos;s Place
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto drop-shadow-md">
                Elevate your culinary experience with our premium cookware and curated gifts.
              </p>
              <Link
                href="/products"
                className="bg-primary-green text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-secondary-green transition-all shadow-lg hover:shadow-xl border-2 border-transparent hover:border-white/20"
              >
                Shop Now
              </Link>
            </div>
          </section>

          {/* Featured Collection */}
          <section className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center text-primary-green">Featured Collection</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/products"
                className="inline-block border-2 border-primary-green text-primary-green px-8 py-2 rounded-full font-semibold hover:bg-primary-green hover:text-cream transition-colors"
              >
                View All Products
              </Link>
            </div>
          </section>

          {/* Value Proposition */}
          <section className="bg-cream py-16">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-primary-green">Premium Quality</h3>
                  <p className="text-text-dark/80">
                    Hand-picked items that meet our high standards for durability and aesthetics.
                  </p>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-primary-green">Sustainable Sourcing</h3>
                  <p className="text-text-dark/80">
                    We prioritize eco-friendly materials and responsible manufacturing processes.
                  </p>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-primary-green">Perfect for Gifting</h3>
                  <p className="text-text-dark/80">
                    Beautifully packaged and curated sets that make for unforgettable gifts.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
