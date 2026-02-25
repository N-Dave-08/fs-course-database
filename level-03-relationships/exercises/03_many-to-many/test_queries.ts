import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
	// const adminRole = await prisma.role.create({
	// 	data: {
	// 		name: "ADMIN",
	// 	},
	// });

	// const userRole = await prisma.role.create({
	// 	data: {
	// 		name: "USER",
	// 	},
	// });

	// const user = await prisma.user.create({
	// 	data: {
	// 		email: "william@gmail.com",
	// 		name: "William",
	// 		roles: {
	// 			create: [
	// 				{ roleId: adminRole.id },
	// 				{
	// 					roleId: userRole.id,
	// 				},
	// 			],
	// 		},
	// 	},
	// 	include: {
	// 		roles: {
	// 			include: {
	// 				role: true,
	// 			},
	// 		},
	// 	},
	// });

	// show only users with roles
	const userWithRoles = await prisma.user.findMany({
		where: {
			roles: { some: {} },
		},

		include: {
			roles: {
				include: {
					role: true,
				},
			},
		},
	});

	console.dir(userWithRoles, {
		depth: null,
	});
}

main()
	.catch(console.error)
	.finally(() => prisma.$disconnect());
