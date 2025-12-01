const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = "malik.himself0@gmail.com";
    const user = await prisma.user.update({
        where: { email: email },
        data: { role: "admin" },
    });
    console.log("Updated user:", user);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
