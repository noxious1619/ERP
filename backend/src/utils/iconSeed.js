// src/utils/iconSeed.ts
// Self-contained — loads .env itself, no imports from your project
//
// Run from backend/ folder:
//   npx tsx src/utils/iconSeed.ts
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env') });
import { PrismaClient } from '../../generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({
    adapter,
});
const ICON_SEED_MAP = [
    { match: "math", icon: "/subjecticons/math.svg" },
    { match: "maths", icon: "/subjecticons/math.svg" },
    { match: "english", icon: "/subjecticons/english.png" },
    { match: "geography", icon: "/subjecticons/geography.svg" },
    { match: "chemistry", icon: "/subjecticons/chemistry.png" },
    { match: "physics", icon: "/subjecticons/physics.png" },
];
async function seedIcons() {
    const subjects = await prisma.subject.findMany({
        select: { id: true, name: true },
    });
    console.log(`\nFound ${subjects.length} subjects.\n`);
    for (const subject of subjects) {
        const lower = subject.name.toLowerCase();
        const match = ICON_SEED_MAP.find((m) => lower.includes(m.match));
        if (match) {
            await prisma.subject.update({
                where: { id: subject.id },
                data: { icon: match.icon },
            });
            console.log(`✓  "${subject.name}" → ${match.icon}`);
        }
        else {
            console.log(`–  "${subject.name}" → no match (SVG fallback)`);
        }
    }
    console.log('\n✅ Done!\n');
    await prisma.$disconnect();
}
seedIcons().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=iconSeed.js.map