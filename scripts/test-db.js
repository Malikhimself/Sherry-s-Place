const { getProducts } = require('../lib/products');
const { getUsers } = require('../lib/users');
const { getOrders } = require('../lib/orders');

async function test() {
    try {
        console.log('Testing Products...');
        const products = await getProducts();
        console.log(`Found ${products.length} products.`);

        console.log('Testing Users...');
        const users = await getUsers();
        console.log(`Found ${users.length} users.`);

        console.log('Testing Orders...');
        const orders = await getOrders();
        console.log(`Found ${orders.length} orders.`);

        if (products.length > 0 && users.length > 0 && orders.length > 0) {
            console.log('SUCCESS: Database migration verified.');
        } else {
            console.error('FAILURE: Missing data.');
            process.exit(1);
        }
    } catch (error) {
        console.error('FAILURE: Error during verification.', error);
        process.exit(1);
    }
}

test();
