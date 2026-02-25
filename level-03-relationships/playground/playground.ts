import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
	// await prisma.role.createMany({
	// 	data: [{ name: "USER" }, { name: "ADMIN" }, { name: "MODERATOR" }],
	// 	skipDuplicates: true,
	// });

	async function createUserWithDefaultRole(data: {
		email: string;
		name: string;
	}) {
		const user = await prisma.user.create({
			data: {
				...data,
				roles: {
					create: {
						roles: {
							connect: {
								name: "USER",
							},
						},
					},
				},
			},
			include: {
				roles: {
					include: {
						roles: true,
					},
				},
			},
		});
		return user;
	}

	createUserWithDefaultRole({ email: "jogn@example.com", name: "John" });

	// await prisma.userRole.delete({
	// 	where: {
	// 		userId_roleId: { userId: 4, roleId: 2 },
	// 	},
	// });

	// await prisma.userRole.create({
	// 	data: {
	// 		users: {
	// 			connect: {
	// 				id: 4,
	// 			},
	// 		},
	// 		roles: {
	// 			connect: {
	// 				name: "MODERATOR",
	// 			},
	// 		},
	// 	},
	// });

	const users = await prisma.user.findUnique({
		where: { id: 4 },
		include: {
			posts: {
				select: {
					title: true,
				},
			},
			profile: {
				select: {
					bio: true,
				},
			},
			roles: {
				select: {
					roles: {
						select: {
							name: true,
						},
					},
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
	.finally(() => prisma.$disconnect());
