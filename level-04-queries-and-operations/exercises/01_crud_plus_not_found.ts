import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
	// 1.
	const user = await prisma.user.create({
		data: {
			name: "Exercise 1",
			email: "exercise01@gmail.com",
			age: 21,
		},
	});

	// 2.
	const users = await prisma.user.findUnique({
		where: {
			id: user.id,
		},
		// 5.
		select: {
			email: true,
			name: true,
		},
	});

	// 3.
	await prisma.user.update({
		where: {
			email: "exercise01@gmail.com",
		},
		data: {
			name: "Exercise 1 upated",
		},
	});

	// 4.
	await prisma.user.delete({
		where: {
			id: user.id,
		},
	});

	console.dir(users, {
		depth: null,
	});
}

main()
	.catch(console.error)
	// every run, it disconnects
	.finally(() => prisma.$disconnect());
