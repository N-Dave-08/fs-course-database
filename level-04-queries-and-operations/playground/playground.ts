import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
	// const users = await prisma.user.findMany({
	// 	where: {
	// 		AND: [
	// 			{ isActive: true },
	// 			{
	// 				OR: [
	// 					{
	// 						roles: {
	// 							some: { roles: { name: "USER" } },
	// 						},
	// 					},
	// 					{
	// 						roles: {
	// 							some: { roles: { name: "MODERATOR" } },
	// 						},
	// 					},
	// 				],
	// 			},
	// 		],
	// 	},
	// 	include: {
	// 		roles: {
	// 			include: {
	// 				roles: true,
	// 			},
	// 		},
	// 	},
	// });

	// convert datetime to ph time
	// users.forEach((u) => {
	// 	console.dir(u.createdAt.toLocaleString("en-PH"), {
	// 		depth: null,
	// 	});
	// });

	// const usersOrderByCreatedDate = await prisma.user.findMany({
	// 	orderBy: [{ createdAt: "desc" }, { id: "asc" }],
	// });

	// const usersPagination = await prisma.user.findMany({
	// 	where: {
	// 		isActive: true,
	// 	},
	// 	orderBy: [{ createdAt: "desc" }, { id: "asc" }],
	// 	take: 2,
	// 	skip: 0,
	// });

	// const count = await prisma.user.count({
	// 	where: {
	// 		isActive: true,
	// 	},
	// });

	const grouped = await prisma.user.groupBy({
		by: ["isActive"],
		_count: { id: true },
		orderBy: { _count: { id: "asc" } },
	});

	console.dir(grouped, {
		depth: null,
	});
}

main()
	.catch(console.error)
	// every run, it disconnects
	.finally(() => prisma.$disconnect());
