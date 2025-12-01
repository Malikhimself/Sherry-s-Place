import Link from "next/link";
import { Plus, Edit, Trash2, Users, ShoppingBag, DollarSign, Package } from "lucide-react";
import { getProducts } from "@/lib/products";
import { getUsers } from "@/lib/users";
import { getOrders } from "@/lib/orders";
import { deleteProductAction } from "@/app/actions";
import AdminCharts from "./components/AdminCharts";

export default async function AdminDashboard() {
    const products = await getProducts();
    const users = await getUsers();
    const orders = await getOrders();

    // Calculate stats
    const totalUsers = users.length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    // Process data for User Growth Chart (Cumulative)
    const userGrowthMap = new Map();
    users.forEach(user => {
        const date = new Date(user.joinedAt);
        const monthYear = date.toLocaleString('default', { month: 'short' }); // e.g., "Jan"
        userGrowthMap.set(monthYear, (userGrowthMap.get(monthYear) || 0) + 1);
    });

    const userGrowthData = [];
    let cumulativeUsers = 0;
    // Assuming data spans a year, we might want to sort by month. 
    // For simplicity with mock data, we'll just use the map entries but in a real app we'd sort chronologically.
    // Let's define the months order to sort correctly
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    months.forEach(month => {
        if (userGrowthMap.has(month)) {
            cumulativeUsers += userGrowthMap.get(month);
            userGrowthData.push({ date: month, users: cumulativeUsers });
        } else if (cumulativeUsers > 0) {
            // Keep the previous count if no new users this month, but only if we have started tracking
            userGrowthData.push({ date: month, users: cumulativeUsers });
        }
    });

    // Process data for Order Trends Chart (Per Month)
    const orderTrendsMap = new Map();
    orders.forEach(order => {
        const date = new Date(order.createdAt);
        const monthYear = date.toLocaleString('default', { month: 'short' });
        orderTrendsMap.set(monthYear, (orderTrendsMap.get(monthYear) || 0) + 1);
    });

    const orderTrendsData = months.map(month => ({
        date: month,
        orders: orderTrendsMap.get(month) || 0
    })).filter(item => item.orders > 0 || userGrowthData.some(d => d.date === item.date)); // Filter to show relevant months

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-primary-green">Admin Dashboard</h1>
                <Link
                    href="/admin/add"
                    className="bg-primary-green text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-secondary-green transition-colors"
                >
                    <Plus size={20} />
                    Add Product
                </Link>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Link href="/admin/users" className="bg-white p-6 rounded-xl shadow-sm border border-primary-green/5 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 font-medium">Total Users</h3>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Users size={20} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-text-dark">{totalUsers}</p>
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                        <span className="font-medium">+12%</span> from last month
                    </p>
                </Link>

                <Link href="/admin/orders" className="bg-white p-6 rounded-xl shadow-sm border border-primary-green/5 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 font-medium">Total Orders</h3>
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                            <ShoppingBag size={20} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-text-dark">{totalOrders}</p>
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                        <span className="font-medium">+8%</span> from last month
                    </p>
                </Link>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-green/5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 font-medium">Total Revenue</h3>
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-text-dark">${totalRevenue.toFixed(2)}</p>
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                        <span className="font-medium">+15%</span> from last month
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-green/5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 font-medium">Total Products</h3>
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                            <Package size={20} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-text-dark">{products.length}</p>
                    <p className="text-sm text-gray-500 mt-2">Active products</p>
                </div>
            </div>

            {/* Charts */}
            <AdminCharts userGrowthData={userGrowthData} orderTrendsData={orderTrendsData} />

            {/* Products Table */}
            <h2 className="text-2xl font-bold text-primary-green mb-6">Products</h2>
            <div className="bg-white rounded-xl shadow-sm border border-primary-green/5 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-cream border-b border-primary-green/10">
                            <th className="p-4 font-semibold text-primary-green">ID</th>
                            <th className="p-4 font-semibold text-primary-green">Name</th>
                            <th className="p-4 font-semibold text-primary-green">Price</th>
                            <th className="p-4 font-semibold text-primary-green">Category</th>
                            <th className="p-4 font-semibold text-primary-green text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                <td className="p-4 text-gray-500">#{product.id}</td>
                                <td className="p-4 font-medium text-text-dark">{product.name}</td>
                                <td className="p-4 text-gray-600">${product.price.toFixed(2)}</td>
                                <td className="p-4 text-gray-600">
                                    <span className="bg-cream text-primary-green px-2 py-1 rounded-full text-xs font-medium border border-primary-green/10">
                                        {product.category}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            href={`/admin/edit/${product.id}`}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </Link>
                                        <form action={deleteProductAction.bind(null, product.id)}>
                                            <button
                                                type="submit"
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
