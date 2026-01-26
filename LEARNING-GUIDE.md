# Database Course Setup Guide

Complete setup instructions for the Prisma database course.

## Prerequisites

1. **Node.js 22+ LTS**
   - Check: `node --version`
   - Download: [nodejs.org](https://nodejs.org/)

2. **pnpm** package manager
   - Check: `pnpm --version`
   - Install: `npm install -g pnpm`

3. **PostgreSQL 16+**
   - Install: [postgresql.org](https://www.postgresql.org/download/)
   - Or use Docker: `docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:16`

## Initial Setup

### Step 1: Navigate to Course Directory

```bash
cd fs-course-database
```

### Step 2: Initialize Package.json

```bash
pnpm init
```

### Step 3: Install Prisma

```bash
pnpm add -D prisma@^7.3.0
pnpm add @prisma/client@^7.3.0
```

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
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
```

Replace with your PostgreSQL credentials.

### Step 6: Create Schema

Edit `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
}
```

### Step 7: Generate Prisma Client

```bash
npx prisma generate
```

### Step 8: Create Migration

```bash
npx prisma migrate dev --name init
```

### Step 9: Verify Setup

Create `test-connection.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log('✅ Database connection successful!');
  console.log('Users:', users);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run: `npx ts-node test-connection.ts`

## Workflow

### Creating Migrations

```bash
npx prisma migrate dev --name migration-name
```

### Generating Prisma Client

```bash
npx prisma generate
```

### Viewing Database

```bash
npx prisma studio
```

Opens Prisma Studio at http://localhost:5555

## Troubleshooting

### Database Connection Error

- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Test connection: `psql $DATABASE_URL`

### Migration Errors

- Reset database: `npx prisma migrate reset`
- Check schema syntax
- Verify database permissions

## Next Steps

1. ✅ Verify setup with test-connection.ts
2. 📖 Start with [Level 1: Database Fundamentals](./level-01-database-fundamentals/lesson-01-introduction.md)
3. 💻 Complete exercises for each level

Happy learning!
