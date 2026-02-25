import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
	// 1.
	// await prisma.user.createMany({
	// 	data: [
	// 		{ name: "Exercise 2", email: "exercise02@example.com", age: 12 },
	// 		{
	// 			name: "Exercise 2 other",
	// 			email: "exercise02other@example.com",
	// 			age: 27,
	// 		},
	// 	],
	// });

	// 2.
	const users = await prisma.user.findMany({
		where: {
			email: { endsWith: "@example.com" },
		},
		orderBy: [{ createdAt: "desc" }, { id: "asc" }],
		take: 1,
		skip: 0,
	});

	// 3.
	const count = await prisma.user.count({
		where: {
			email: { endsWith: "@example.com" },
		},
	});
	console.log("total count: ", count);

	console.dir(users, {
		depth: null,
	});
}

main()
	.catch(console.error)
	// every run, it disconnects
	.finally(() => prisma.$disconnect());
