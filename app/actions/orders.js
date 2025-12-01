"use server";

import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

export async function createOrder(cartItems, total) {
    try {
        const session = await auth();
        if (!session?.user) {
            return { error: "Not authenticated" };
        }

        // Create the order
        const order = await prisma.order.create({
            data: {
                userId: parseInt(session.user.id),
                total,
                status: "pending",
                items: {
                    create: cartItems.map((item) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
        });

        return { success: true, orderId: order.id };
    } catch (error) {
        console.error("Create order error:", error);
        return { error: "Failed to create order" };
    }
}

export async function getUserOrders() {
    try {
        const session = await auth();
        if (!session?.user) {
            return { error: "Not authenticated" };
        }

        const orders = await prisma.order.findMany({
            where: {
                userId: parseInt(session.user.id),
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return { success: true, orders };
    } catch (error) {
        console.error("Get user orders error:", error);
        return { error: "Failed to fetch orders" };
    }
}

export async function getOrderById(orderId) {
    try {
        const session = await auth();
        if (!session?.user) {
            return { error: "Not authenticated" };
        }

        const order = await prisma.order.findUnique({
            where: {
                id: parseInt(orderId),
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!order) {
            return { error: "Order not found" };
        }

        // Verify ownership
        if (order.userId !== parseInt(session.user.id) && session.user.role !== "admin") {
            return { error: "Unauthorized" };
        }

        return { success: true, order };
    } catch (error) {
        console.error("Get order error:", error);
        return { error: "Failed to fetch order" };
    }
}

export async function updateOrderStatus(orderId, status) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "admin") {
            return { error: "Unauthorized" };
        }

        const order = await prisma.order.update({
            where: { id: parseInt(orderId) },
            data: { status },
        });

        return { success: true, order };
    } catch (error) {
        console.error("Update order status error:", error);
        return { error: "Failed to update order status" };
    }
}
