const Database = require('better-sqlite3');
const { PrismaClient } = require('@prisma/client');
const path = require('path');

const prisma = new PrismaClient();
const sqlitePath = path.join(process.cwd(), 'prisma', 'dev.db');
const db = new Database(sqlitePath);

async function migrate() {
    console.log('Starting migration...');
    console.log(`Reading from ${sqlitePath}`);

    try {
        // 1. Users
        console.log('Migrating Users...');
        const users = db.prepare('SELECT * FROM User').all();
        for (const user of users) {
            await prisma.user.upsert({
                where: { id: user.id },
                update: {
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
                    image: user.image,
                    role: user.role,
                    joinedAt: user.joinedAt ? new Date(user.joinedAt) : undefined,
                },
                create: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
                    image: user.image,
                    role: user.role,
                    joinedAt: user.joinedAt ? new Date(user.joinedAt) : undefined,
                }
            });
        }
        console.log(`Migrated ${users.length} users.`);

        // 2. Products
        console.log('Migrating Products...');
        const products = db.prepare('SELECT * FROM Product').all();
        for (const product of products) {
            await prisma.product.upsert({
                where: { id: product.id },
                update: {
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    image: product.image,
                    category: product.category,
                    createdAt: new Date(product.createdAt),
                    updatedAt: new Date(product.updatedAt),
                },
                create: {
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    image: product.image,
                    category: product.category,
                    createdAt: new Date(product.createdAt),
                    updatedAt: new Date(product.updatedAt),
                }
            });
        }
        console.log(`Migrated ${products.length} products.`);

        // 3. Orders
        console.log('Migrating Orders...');
        const orders = db.prepare('SELECT * FROM "Order"').all();
        for (const order of orders) {
            await prisma.order.upsert({
                where: { id: order.id },
                update: {
                    userId: order.userId,
                    total: order.total,
                    status: order.status,
                    createdAt: new Date(order.createdAt),
                    updatedAt: new Date(order.updatedAt),
                },
                create: {
                    id: order.id,
                    userId: order.userId,
                    total: order.total,
                    status: order.status,
                    createdAt: new Date(order.createdAt),
                    updatedAt: new Date(order.updatedAt),
                }
            });
        }
        console.log(`Migrated ${orders.length} orders.`);

        // 4. OrderItems
        console.log('Migrating OrderItems...');
        const orderItems = db.prepare('SELECT * FROM OrderItem').all();
        for (const item of orderItems) {
            await prisma.orderItem.upsert({
                where: { id: item.id },
                update: {
                    orderId: item.orderId,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                },
                create: {
                    id: item.id,
                    orderId: item.orderId,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                }
            });
        }
        console.log(`Migrated ${orderItems.length} order items.`);

        // Reset sequences
        console.log('Resetting sequences...');
        try {
            const tables = ['User', 'Product', '"Order"', 'OrderItem'];
            for (const table of tables) {
                const tableName = table.replace(/"/g, '');
                const result = await prisma.$queryRawUnsafe(`SELECT MAX(id) as max_id FROM "${tableName}"`);
                const maxId = result[0].max_id;
                if (maxId) {
                    await prisma.$queryRawUnsafe(`SELECT setval(pg_get_serial_sequence('"${tableName}"', 'id'), ${maxId})`);
                }
            }
        } catch (err) {
            console.error('Error resetting sequences (non-fatal):', err);
        }

        console.log('Migration completed successfully.');
    } catch (e) {
        console.error('Migration failed:', e);
    } finally {
        await prisma.$disconnect();
        db.close();
    }
}

migrate();
