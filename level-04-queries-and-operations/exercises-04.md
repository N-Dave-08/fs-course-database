# Exercises 04: Queries and Operations

## Learning Objectives

By completing these exercises, you will:
- ✅ Perform CRUD safely with Prisma (and handle not-found behavior)
- ✅ Filter, sort, and paginate lists predictably
- ✅ Use aggregations and `groupBy` for reporting-style queries
- ✅ Query related data with `include` and safer `select`

## Before You Start

**Prerequisites:**
- Level 1 (database + SQL fundamentals)
- Level 2 (Prisma basics: schema + client)
- Level 3 (relationships)

**Setup:**
1. Navigate to `fs-course-database/level-04-queries-and-operations/`
2. Create `exercises/` directory
3. Ensure your database has the models from previous levels (User + relations from Level 3)

---

## Exercise 1: CRUD + “Not Found” Behavior

**Objective:** Understand which Prisma operations return `null` vs throw.

**Deliverable:** `exercises/exercise-01.ts`

**Instructions:**
In one script:
1. Create a user
2. Read by id using `findUnique` (observe `null` when missing)
3. Update a user (observe “throws when missing” behavior)
4. Delete a user (observe “throws when missing” behavior)
5. Use `select` to return only safe fields

---

## Exercise 2: Filtering + Sorting + Pagination (Stable)

**Objective:** Build list queries that stay predictable.

**Deliverable:** `exercises/exercise-02.ts`

**Instructions:**
1. Seed a few users (make emails unique so re-running doesn’t break)
2. Query users:
   - filter: `email` endsWith `"@example.com"`
   - sort: `createdAt desc`, tie-breaker `id asc`
   - paginate: `take` / `skip`
3. Print results and total count.

**Hint:** Use a unique suffix like `Date.now()` in emails when seeding.

---

## Exercise 3: Aggregations + `groupBy`

**Objective:** Compute dashboard-style summaries in the database.

**Deliverable:** `exercises/exercise-03.ts`

**Instructions:**
1. Count total users
2. Count active users (if you have `active`)
3. Group users by `role` (if you have `role`) and count per role

If your schema does not have `active`/`role`, add them in Level 2 exercises (or adjust your queries to group by another categorical field you have).

---

## Exercise 4: Query Related Data Safely

**Objective:** Practice `include` vs safer `select` on relationships.

**Deliverable:** `exercises/exercise-04.ts`

**Instructions:**
Using the relationship models from Level 3:
1. Create a user with a profile (one-to-one) and at least one post (one-to-many)
2. Query the user with relations:
   - first using `include`
   - then using `select` to return a minimal “API-safe” payload

---

## Running Exercises

```bash
npx ts-node exercises/exercise-01.ts
npx ts-node exercises/exercise-02.ts
npx ts-node exercises/exercise-03.ts
npx ts-node exercises/exercise-04.ts
```

## Verification Checklist

- [ ] I understand which operations return `null` vs throw
- [ ] My list query uses stable ordering and pagination
- [ ] I can compute counts and groupBy summaries
- [ ] I can query relations with `include` and avoid overfetching with `select`

## Next Steps

1. ✅ **Practice**: Add one more filter (e.g., createdAt >= last 30 days)
2. ✅ **Experiment**: Add cursor pagination (preview)
3. 📖 **Next Level**: Move to migrations
4. 💻 **Complete Exercises**: Continue with [Exercises 05](../level-05-migrations/exercises-05.md)

---

**Key Takeaways:**
- Pagination and stable ordering prevent “random” page results.
- Aggregations belong in the database—don’t fetch entire tables to compute counts.
- Use `select` to avoid leaking fields and to reduce payload size.
