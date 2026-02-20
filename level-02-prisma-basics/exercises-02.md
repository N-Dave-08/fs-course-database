X# Exercises 02: Prisma Basics (Schema + Client)

## Learning Objectives

By completing these exercises, you will:
- ✅ Define clean Prisma models (types, defaults, optionality)
- ✅ Use constraints (`@unique`) and timestamps (`@default(now())`, `@updatedAt`)
- ✅ Use enums for safe fixed values
- ✅ Generate and apply migrations with Prisma
- ✅ Write a minimal Prisma Client script (typed CRUD)

## Before You Start

**Prerequisites:**
- Completed Level 1 lessons (database + SQL fundamentals)
- Completed Level 2 lessons:
  - `lesson-01-prisma-introduction.md`
  - `lesson-02-schema-definition.md`
  - `lesson-03-basic-models.md`
- Prisma installed/configured (see `../../LEARNING-GUIDE.md`)
- PostgreSQL running

**Setup:**
1. Navigate to `fs-course-database/level-02-prisma-basics/`
2. Ensure `prisma/schema.prisma` exists
3. Create a folder for your scripts:
   - `exercises/`

---

## Exercise 1: Create a Clean `User` Model

**Objective:** Create a practical `User` model with good defaults.

**Deliverable:** update `prisma/schema.prisma`

**Requirements:**
- `id` (autoincrement primary key)
- `email` (unique)
- `name` (required)
- `createdAt` (default now)
- `updatedAt` (auto-updated)

**Example (guide):**

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

**Verification:**
- `npx prisma format`
- `npx prisma validate`

---

## Exercise 2: Defaults + Optional Fields + Enum

**Objective:** Add realistic fields and practice intentional optionality.

**Deliverable:** update `prisma/schema.prisma`

**Requirements:**
- Add `role` as an enum with default
- Add `active` boolean with default
- Add one optional field (e.g., `bio String?`)

**Example (guide):**

```prisma
enum Role {
  USER
  ADMIN
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  bio       String?
  role      Role     @default(USER)
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

---

## Exercise 3: Create and Apply a Migration

**Objective:** Generate a migration and verify it in the database.

**Deliverable:** a new folder under `prisma/migrations/`

**Steps:**
1. Create/apply migration:

```bash
npx prisma migrate dev --name init_user_model
```

2. Open Prisma Studio:

```bash
npx prisma studio
```

**Verification:**
- Migration exists under `prisma/migrations/`
- Prisma Studio shows the `users` table

---

## Exercise 4: Write a Minimal Prisma Client Script (CRUD)

**Objective:** Practice typed CRUD using Prisma Client.

**Deliverable:** `exercises/exercise-01.ts`

**Instructions:**
Create a script that:
1. Creates a user
2. Reads users (`findMany`)
3. Updates a user
4. Deletes a user
5. Uses `select` to avoid overfetching

**Example (guide):**

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const created = await prisma.user.create({
    data: { email: "alice@example.com", name: "Alice", role: "USER" },
    select: { id: true, email: true, name: true, role: true },
  });

  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, active: true },
  });

  const updated = await prisma.user.update({
    where: { id: created.id },
    data: { name: "Alice Updated" },
    select: { id: true, name: true },
  });

  await prisma.user.delete({ where: { id: created.id } });

  console.log({ created, users, updated });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

**Run:**

```bash
npx ts-node exercises/exercise-01.ts
```

---

## Verification Checklist

- [X] My schema is formatted and valid
- [X] Migration created and applied successfully
- [X] Prisma Studio shows my table
- [X] My CRUD script runs successfully

## Next Steps

Now that you can define models and use Prisma Client:

1. ✅ **Practice**: Add a second independent model (e.g., `Tag`) without relations
2. ✅ **Experiment**: Add a unique constraint and intentionally trigger it
3. 📖 **Next Level**: Move to relationships (how models connect)
4. 💻 **Complete Exercises**: Continue with [Exercises 03](../level-03-relationships/exercises-03.md)

---

**Key Takeaways:**
- Prisma schemas define types + constraints that become real tables.
- Migrations are production-grade changes—treat them like code.
- Prisma Client gives typed CRUD, but you should still understand SQL fundamentals.
