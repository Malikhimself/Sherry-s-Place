import { getUsers } from "@/lib/users";
import { deleteUserAction } from "@/app/actions";
import Link from "next/link";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";

export default async function AdminUsersPage() {
    const users = await getUsers();

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin" className="text-primary-green hover:text-secondary-green transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-3xl font-bold text-primary-green">Users</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-primary-green/5 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-cream border-b border-primary-green/10">
                            <th className="p-4 font-semibold text-primary-green">ID</th>
                            <th className="p-4 font-semibold text-primary-green">Name</th>
                            <th className="p-4 font-semibold text-primary-green">Email</th>
                            <th className="p-4 font-semibold text-primary-green">Role</th>
                            <th className="p-4 font-semibold text-primary-green">Joined At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                <td className="p-4 text-gray-500">#{user.id}</td>
                                <td className="p-4 font-medium text-text-dark">{user.name}</td>
                                <td className="p-4 text-gray-600">{user.email}</td>
                                <td className="p-4 text-gray-600">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${user.role === 'admin'
                                        ? 'bg-purple-50 text-purple-700 border-purple-100'
                                        : 'bg-blue-50 text-blue-700 border-blue-100'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-600">{new Date(user.joinedAt).toLocaleDateString()}</td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            href={`/admin/users/${user.id}`}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </Link>
                                        <form action={deleteUserAction.bind(null, user.id)}>
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
