import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
	// 1.
	const userCount = await prisma.user.count();
	console.log("total users: ", userCount);

	// 2.
	const activeUsers = await prisma.user.count({
		where: {
			isActive: true,
		},
	});
	console.log("total active users: ", activeUsers);

	// 3.
	const grouped = await prisma.user.groupBy({
		by: ["isActive"],
	});
	console.log("group by activity: ", grouped);

	// console.dir(users, {
	// 	depth: null,
	// });
}

main()
	.catch(console.error)
	// every run, it disconnects
	.finally(() => prisma.$disconnect());
