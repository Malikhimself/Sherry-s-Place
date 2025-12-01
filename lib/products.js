import prisma from './prisma';

export async function getProducts() {
    try {
        const products = await prisma.product.findMany();
        return products;
    } catch (error) {
        console.error("Error reading products:", error);
        return [];
    }
}

export async function getProduct(id) {
    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
        });
        return product;
    } catch (error) {
        console.error("Error getting product:", error);
        return null;
    }
}

export async function addProduct(product) {
    try {
        const newProduct = await prisma.product.create({
            data: {
                name: product.name,
                description: product.description,
                price: product.price,
                image: product.image,
                category: product.category,
            },
        });
        return newProduct;
    } catch (error) {
        console.error("Error adding product:", error);
        return null;
    }
}

export async function updateProduct(id, updates) {
    try {
        const updatedProduct = await prisma.product.update({
            where: { id: parseInt(id) },
            data: updates,
        });
        return updatedProduct;
    } catch (error) {
        console.error("Error updating product:", error);
        return null;
    }
}

export async function deleteProduct(id) {
    try {
        await prisma.product.delete({
            where: { id: parseInt(id) },
        });
        return true;
    } catch (error) {
        console.error("Error deleting product:", error);
        return false;
    }
}
