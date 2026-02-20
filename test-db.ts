import "dotenv/config"; // Load .env for DATABASE_URL
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
	const users = await prisma.user.findMany();
	console.log("Connection OK! Users:", users);

	// Optional: create one
	await prisma.user.create({
		data: { email: "test@example.com", name: "Test User" },
	});
}

main()
	.catch((e) => console.error(e))
	.finally(async () => await prisma.$disconnect());
