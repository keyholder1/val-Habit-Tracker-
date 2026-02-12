const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkGoals() {
    try {
        const goals = await prisma.goal.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5
        });
        console.log('--- LATEST 5 GOALS ---');
        console.log(JSON.stringify(goals, null, 2));
    } catch (e) {
        console.error('Error fetching goals:', e);
    } finally {
        await prisma.$disconnect();
    }
}
checkGoals();
