# Exercises 06: Advanced Schema (Indexes, Constraints, Optimization)

## Learning Objectives

By completing these exercises, you will:
- ✅ Add indexes that match real query patterns
- ✅ Add constraints that protect data integrity
- ✅ Write a small “optimized query” script (select + pagination)
- ✅ Understand where performance wins actually come from

## Before You Start

**Prerequisites:**
- Completed Levels 1–5
- Prisma + database are running
- Your schema has a `User` model (and ideally some data)

**Setup:**
1. Navigate to `fs-course-database/level-06-advanced-schema/`
2. Create an `exercises/` directory

---

## Exercise 1: Add Indexes (Match Query Patterns)

**Objective:** Add indexes based on how you query.

**Deliverable:** update `prisma/schema.prisma` + a migration

**Instructions:**
Add indexes such as:
- an index to support sorting/filtering by name
- a composite index that matches a common “filter + sort” pattern

**Example (guide):**

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  role      Role     @default(USER)
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([name])
  @@index([role, createdAt])
  @@map("users")
}
```

Create/apply migration:

```bash
npx prisma migrate dev --name add_user_indexes
```

---

## Exercise 2: Add Constraints (Integrity)

**Objective:** Add constraints that prevent invalid states.

**Deliverable:** update `prisma/schema.prisma` + a migration

**Instructions:**
1. Add at least one composite uniqueness constraint where it makes sense (example: membership join table)
2. Ensure foreign keys exist on relationship models (from Level 3)

Create/apply migration:

```bash
npx prisma migrate dev --name add_constraints
```

---

## Exercise 3: Write an “Optimized Query” Script

**Objective:** Practice high-impact wins: select less + paginate.

**Deliverable:** `exercises/exercise-03.ts`

**Instructions:**
Write a script that:
1. Queries a user list using:
   - `select` (only id/email/name/role)
   - `orderBy` with stable tie-breaker
   - `take`
2. Queries by an indexed field (email)

---

## Running Exercises

```bash
npx prisma migrate dev --name <migration_name>
npx ts-node exercises/exercise-03.ts
```

## Verification Checklist

- [ ] I added indexes that match real query patterns
- [ ] I added constraints that protect integrity
- [ ] My optimized query uses `select` + pagination
- [ ] I understand why indexes speed reads but slow writes

---

**Key Takeaways:**
- Indexes should be driven by real query patterns, not guesses.
- Constraints protect correctness even when code is buggy.
- Most performance wins come from selecting less + paginating.
