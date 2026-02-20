import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
	const created = await prisma.user.create({
		data: {
			email: "bob@domain.com",
			name: "Bob",
			role: "USER",
			isActive: true,
		},
		select: {
			id: true,
			email: true,
			name: true,
			role: true,
		},
	});

	const users = await prisma.user.findMany({
		select: {
			id: true,
			email: true,
			name: true,
			role: true,
			isActive: true,
		},
	});

	const updated = await prisma.user.update({
		where: {
			id: created.id,
		},
		data: {
			name: "Bob updated",
		},
		select: {
			id: true,
			name: true,
		},
	});

	await prisma.user.delete({
		where: {
			id: created.id,
		},
	});

	console.log({
		created,
		users,
		updated,
	});
}

main()
	.catch(console.error)
	.finally(() => prisma.$disconnect());
