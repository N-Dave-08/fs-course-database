# Database Course Setup Guide

Complete setup instructions for the Prisma database course (updated for 2026 best practices with Prisma 7+).

## Prerequisites

1. **Node.js 20+ or 22+ LTS**
   - Check: `node --version`
   - Download: [nodejs.org](https://nodejs.org/)

2. **pnpm** package manager
   - Check: `pnpm --version`
   - Install: `npm install -g pnpm`

3. **PostgreSQL 17+**
   - Recommended: Use Docker for easy setup.
     ```bash
     docker run -d \
       --name course-postgres \
       -e POSTGRES_PASSWORD=mysecretpassword \
       -e POSTGRES_USER=postgres \
       -e POSTGRES_DB=course_db \
       -p 5432:5432 \
       postgres:17
     ```
   - Alternative: Native install from [postgresql.org](https://www.postgresql.org/download/). Create a database (e.g., `course_db`), user (`postgres`), and password (`mysecretpassword`).

4. **TypeScript Tools** (for running .ts scripts)
   - Install during setup: `pnpm add -D tsx typescript @types/node`

## Initial Setup

### Step 1: Clone and Navigate to Repository

```bash
git clone https://github.com/N-Dave-08/fs-course-database.git
cd fs-course-database
```

### Step 2: Initialize Package.json

```bash
pnpm init
```

### Step 3: Install Prisma and Adapter

```bash
pnpm add -D prisma
pnpm add @prisma/client @prisma/adapter-pg
```

This installs the latest stable Prisma 7+.

### Step 4: Initialize Prisma

```bash
npx prisma init
```

This creates:
- `prisma/schema.prisma` - Database schema
- `.env` - Environment variables

### Step 5: Configure Database Connection

Edit `.env`:

```env
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/course_db?schema=public"
```

Replace with your PostgreSQL credentials if different.

### Step 6: Create Prisma Config File

Create `prisma.config.ts` in the project root:

```typescript
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
```

### Step 7: Create Schema

Edit `prisma/schema.prisma` (remove any `url` from datasource):

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Step 8: Generate Prisma Client

```bash
npx prisma generate
```

### Step 9: Create and Apply Migration

```bash
npx prisma migrate dev --name init
```

### Step 10: Install TypeScript Tools

```bash
pnpm add -D tsx typescript @types/node
```

Create or update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

### Step 11: Verify Setup

Create `test-db.ts`:

```typescript
import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.user.findMany();
  console.log('Connection OK! Users:', users);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
```

Run: `npx tsx test-db.ts`

Should output: `Connection OK! Users: []`

## Workflow

### Making Schema Changes

1. Edit `prisma/schema.prisma`
2. Generate client: `npx prisma generate`
3. Migrate: `npx prisma migrate dev --name descriptive-name`

### Viewing Database

```bash
npx prisma studio
```

Opens Prisma Studio at http://localhost:5555

## Troubleshooting

### Database Connection Error

- Verify Docker/PostgreSQL is running: `docker ps` or check native service.
- Check DATABASE_URL in `.env`.
- Test connection manually: Install `psql` and run `psql $DATABASE_URL`.

### Migration Errors

- Reset database (loses data): `npx prisma migrate reset`
- Check schema syntax in `prisma/schema.prisma`.
- Verify database permissions and that the DB exists.

### TypeScript/Run Errors

- Ensure `tsconfig.json` exists.
- If using PowerShell for Docker, use backticks `` ` `` for line continuation.

## Next Steps

1. ✅ Verify setup with `test-db.ts`
2. 📖 Start with [Level 1: Database Fundamentals](./level-01-database-fundamentals/lesson-01-introduction.md)
3. 💻 Complete exercises for each level
