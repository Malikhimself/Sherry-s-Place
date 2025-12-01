'use server'

import { addProduct, updateProduct, deleteProduct } from "@/lib/products";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import fs from "fs/promises";
import path from "path";

// --- Product Actions ---

export async function createProductAction(formData) {
    const imageFile = formData.get("imageFile");
    let imagePath = null;

    if (imageFile && imageFile.size > 0) {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const filename = `${Date.now()}-${imageFile.name.replace(/\s/g, '-')}`;
        const uploadDir = path.join(process.cwd(), "public/products");

        // Ensure directory exists
        try {
            await fs.access(uploadDir);
        } catch {
            await fs.mkdir(uploadDir, { recursive: true });
        }

        await fs.writeFile(path.join(uploadDir, filename), buffer);
        imagePath = `/products/${filename}`;
    }

    const product = {
        name: formData.get("name"),
        description: formData.get("description"),
        price: parseFloat(formData.get("price")),
        category: formData.get("category"),
        image: imagePath,
    };

    await addProduct(product);
    revalidatePath("/products");
    revalidatePath("/admin");
    redirect("/admin");
}

export async function updateProductAction(id, formData) {
    const imageFile = formData.get("imageFile");
    let imagePath = undefined; // undefined means no change

    if (imageFile && imageFile.size > 0) {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const filename = `${Date.now()}-${imageFile.name.replace(/\s/g, '-')}`;
        const uploadDir = path.join(process.cwd(), "public/products");

        // Ensure directory exists
        try {
            await fs.access(uploadDir);
        } catch {
            await fs.mkdir(uploadDir, { recursive: true });
        }

        await fs.writeFile(path.join(uploadDir, filename), buffer);
        imagePath = `/products/${filename}`;
    }

    const updates = {
        name: formData.get("name"),
        description: formData.get("description"),
        price: parseFloat(formData.get("price")),
        category: formData.get("category"),
    };

    if (imagePath) {
        updates.image = imagePath;
    }

    await updateProduct(id, updates);
    revalidatePath(`/products/${id}`);
    revalidatePath("/products");
    revalidatePath("/admin");
    redirect("/admin");
}

export async function deleteProductAction(id) {
    await deleteProduct(id);
    revalidatePath("/products");
    revalidatePath("/admin");
}

// --- User Actions ---

export async function updateUserAction(id, formData) {
    const role = formData.get("role");

    try {
        await prisma.user.update({
            where: { id: parseInt(id) },
            data: { role },
        });
        revalidatePath("/admin/users");
        revalidatePath(`/admin/users/${id}`);
    } catch (error) {
        console.error("Error updating user:", error);
    }
    redirect("/admin/users");
}

export async function deleteUserAction(id) {
    try {
        await prisma.user.delete({
            where: { id: parseInt(id) },
        });
        revalidatePath("/admin/users");
    } catch (error) {
        console.error("Error deleting user:", error);
    }
    redirect("/admin/users");
}

// --- Order Actions ---

export async function updateOrderAction(id, formData) {
    const status = formData.get("status");

    try {
        await prisma.order.update({
            where: { id: parseInt(id) },
            data: { status },
        });
        revalidatePath("/admin/orders");
        revalidatePath(`/admin/orders/${id}`);
    } catch (error) {
        console.error("Error updating order:", error);
    }
    redirect("/admin/orders");
}

export async function deleteOrderAction(id) {
    try {
        // Delete order items first (cascade delete is better handled in schema but for safety here)
        await prisma.orderItem.deleteMany({
            where: { orderId: parseInt(id) },
        });
        await prisma.order.delete({
            where: { id: parseInt(id) },
        });
        revalidatePath("/admin/orders");
    } catch (error) {
        console.error("Error deleting order:", error);
    }
    redirect("/admin/orders");
}
