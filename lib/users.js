import prisma from './prisma';

export async function getUsers() {
    try {
        const users = await prisma.user.findMany();
        return users;
    } catch (error) {
        console.error("Error reading users:", error);
        return [];
    }
}

export async function getUser(id) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
        });
        return user;
    } catch (error) {
        console.error("Error getting user:", error);
        return null;
    }
}
