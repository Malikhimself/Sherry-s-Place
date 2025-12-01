const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Verifying data in database...');

        const productsCount = await prisma.product.count();
        console.log(`Products: ${productsCount}`);

        const usersCount = await prisma.user.count();
        console.log(`Users: ${usersCount}`);

        const ordersCount = await prisma.order.count();
        console.log(`Orders: ${ordersCount}`);

        if (productsCount > 0 && usersCount > 0 && ordersCount > 0) {
            console.log('SUCCESS: Data found in database.');
        } else {
            console.error('FAILURE: Some data is missing.');
            process.exit(1);
        }
    } catch (error) {
        console.error('FAILURE: Error connecting to database.', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
