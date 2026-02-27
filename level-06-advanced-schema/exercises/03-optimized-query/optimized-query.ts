import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
	const users = await prisma.user.findMany({
		select: {
			id: true,
			email: true,
			roles: true,
		},
		orderBy: { id: "asc" },
		take: 2,
		skip: 0,
	});

	console.dir(users, {
		depth: null,
	});
}

main()
	.catch(console.error)
	.finally(() => prisma.$disconnect());
