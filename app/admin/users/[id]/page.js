import { getUser } from "@/lib/users";
import { updateUserAction } from "@/app/actions";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default async function EditUserPage({ params }) {
    const { id } = await params;
    const user = await getUser(id);

    if (!user) {
        return <div className="container mx-auto px-4 py-12">User not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/users" className="text-primary-green hover:text-secondary-green transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-3xl font-bold text-primary-green">Edit User</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-primary-green/5 p-8 max-w-2xl">
                <form action={updateUserAction.bind(null, user.id)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                            type="text"
                            value={user.name}
                            disabled
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={user.email}
                            disabled
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                        <select
                            name="role"
                            defaultValue={user.role}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none transition-all"
                        >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="bg-primary-green text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-secondary-green transition-colors"
                        >
                            <Save size={20} />
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
