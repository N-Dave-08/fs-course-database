import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
	const userWithProfile = await prisma.user.findMany({
		where: {
			profile: {
				isNot: null,
			},
		},
		include: {
			profile: true,
		},
	});

	console.dir(userWithProfile, {
		depth: null,
	});
}

main()
	.catch(console.error)
	.finally(() => prisma.$disconnect());
