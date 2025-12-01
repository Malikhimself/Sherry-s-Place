import prisma from './prisma';

export async function getOrders() {
    try {
        const orders = await prisma.order.findMany({
            include: {
                items: true,
                user: true
            },
            orderBy: { createdAt: 'desc' }
        });
        return orders;
    } catch (error) {
        console.error("Error reading orders:", error);
        return [];
    }
}

export async function getOrder(id) {
    try {
        const order = await prisma.order.findUnique({
            where: { id: parseInt(id) },
            include: { items: true },
        });
        return order;
    } catch (error) {
        console.error("Error getting order:", error);
        return null;
    }
}
