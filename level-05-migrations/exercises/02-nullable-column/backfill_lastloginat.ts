import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
	await prisma.user.updateMany({
		data: {
			lastLoginAt: new Date(),
		},
	});
}

main()
	.catch(console.error)
	.finally(() => prisma.$disconnect());
