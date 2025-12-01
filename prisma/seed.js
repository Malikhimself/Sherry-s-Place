const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
    // Read JSON data
    const productsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/products.json'), 'utf8'));
    const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf8'));
    const ordersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/orders.json'), 'utf8'));

    console.log('Seeding products...');
    for (const product of productsData) {
        await prisma.product.upsert({
            where: { id: product.id },
            update: {},
            create: {
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                image: product.image,
                category: product.category,
            },
        });
    }

    console.log('Seeding users...');
    for (const user of usersData) {
        await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                joinedAt: new Date(user.joinedAt),
            },
        });
    }

    console.log('Seeding orders...');
    for (const order of ordersData) {
        // Create order first
        const newOrder = await prisma.order.upsert({
            where: { id: order.id },
            update: {},
            create: {
                id: order.id,
                userId: order.userId,
                total: order.total,
                status: order.status,
                createdAt: new Date(order.createdAt),
            },
        });

        // Create order items
        for (const item of order.items) {
            await prisma.orderItem.create({
                data: {
                    orderId: newOrder.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                },
            });
        }
    }

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
