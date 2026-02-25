import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
	// await prisma.user.create({
	// 	data: {
	// 		name: "Alice",
	// 		email: "alice@example.com",
	// 		posts: {
	// 			create: [
	// 				{
	// 					title: "Alice's Post",
	// 					content: "This is the life of alice.",
	// 					published: true,
	// 				},
	// 				{
	// 					title: "Alice's Second Post",
	// 					content: "This is the story of alice.",
	// 					published: true,
	// 				},
	// 			],
	// 		},
	// 	},
	// 	include: {
	// 		posts: true,
	// 	},
	// });

	// await prisma.post.create({
	// 	data: {
	// 		title: "Alice's Third Post",
	// 		content: "This is alice's third post",
	// 		published: false,
	// 		userId: 6,
	// 	},
	// });

	// show only users with posts
	const userWithPosts = await prisma.user.findMany({
		where: {
			posts: { some: { published: true } },
		},

		// show only posts that are published
		include: {
			posts: {
				where: {
					published: true,
				},
			},
		},
	});

	// try onDelete: Cascade if working
	await prisma.user.delete({
		where: {
			id: 6,
		},
	});

	console.dir(userWithPosts, {
		depth: null,
	});
}

main()
	.catch(console.error)
	.finally(() => prisma.$disconnect());
