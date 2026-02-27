import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
	await prisma.user.create({
		data: {
			name: "Negative Age",
			email: "negativeage@email.com",
			age: -5,
		},
		// data: {
		// 	age: 5,
		// },
	});
	const users = await prisma.user.findMany({
		where: { name: "Alice" },
	});

	console.log(users);
}

main()
	.catch(console.error)
	.finally(() => prisma.$disconnect());
