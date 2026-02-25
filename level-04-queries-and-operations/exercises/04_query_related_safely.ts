import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
	// 1.
	// const user = await prisma.user.create({
	// 	data: {
	// 		name: "Exercise 4",
	// 		email: "exercise04@example.com",
	// 		age: 27,
	// 		profile: {
	// 			create: {
	// 				bio: "Exercise 4 profile",
	// 			},
	// 		},
	// 		posts: {
	// 			create: [
	// 				{ title: "Exercise 4 first post" },
	// 				{ title: "Exercise 4 second post" },
	// 			],
	// 		},
	// 	},
	// });

	// 2.
	const users = await prisma.user.findMany({
		where: {
			posts: {
				some: {},
			},
		},
		// include
		// include: {
		// 	posts: {
		// 		select: {
		// 			title: true,
		// 		},
		// 	},
		// },
		// select
		select: {
			name: true,
			posts: {
				select: {
					title: true,
				},
			},
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
