import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/index.js";
import { getClassesWithSections } from "../src/controllers/adminNoticeController.js";
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function main() {
    const req = {};
    const res = {
        status: (code) => {
            console.log("Status Code:", code);
            return res;
        },
        json: (data) => {
            console.log("Response JSON:");
            console.log(JSON.stringify(data, null, 2));
        }
    };
    await getClassesWithSections(req, res);
}
main()
    .catch(console.error)
    .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
});
//# sourceMappingURL=test-api.js.map