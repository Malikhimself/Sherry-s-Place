import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { getProduct } from "@/lib/products";
import { updateProductAction } from "@/app/actions";

export default async function EditProductPage({ params }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-3xl font-bold text-primary-green mb-4">Product Not Found</h1>
                <Link href="/admin" className="text-secondary-green hover:underline">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <Link href="/admin" className="inline-flex items-center text-gray-600 hover:text-primary-green mb-8 transition-colors">
                <ArrowLeft size={20} className="mr-2" />
                Back to Dashboard
            </Link>

            <h1 className="text-3xl font-bold mb-8 text-primary-green">Edit Product</h1>

            <form action={updateProductAction.bind(null, product.id)} className="bg-white rounded-xl shadow-sm border border-primary-green/5 p-8 space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        defaultValue={product.name}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none transition-all"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        defaultValue={product.description}
                        required
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none transition-all"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            defaultValue={product.price}
                            required
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            id="category"
                            name="category"
                            defaultValue={product.category}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none transition-all bg-white"
                        >
                            <option value="">Select Category</option>
                            <option value="Cookware">Cookware</option>
                            <option value="Decor">Decor</option>
                            <option value="Kitchen Tools">Kitchen Tools</option>
                            <option value="Home Fragrance">Home Fragrance</option>
                            <option value="Serveware">Serveware</option>
                            <option value="Linens">Linens</option>
                            <option value="Appliances">Appliances</option>
                            <option value="Glassware">Glassware</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                    <div className="flex flex-col gap-2">
                        {product.image && (
                            <div className="text-sm text-gray-500">
                                Current image: <span className="font-medium">{product.image.split('/').pop()}</span>
                            </div>
                        )}
                        <input
                            type="file"
                            id="image"
                            name="imageFile"
                            accept="image/*"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none transition-all"
                        />
                        <p className="text-xs text-gray-500">Upload a new image to replace the current one.</p>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full bg-primary-green text-white py-3 rounded-lg font-semibold hover:bg-secondary-green transition-colors flex items-center justify-center gap-2 shadow-lg active:scale-95"
                    >
                        <Save size={20} />
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
