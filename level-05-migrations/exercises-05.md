# Exercises 05: Migrations (Safe Schema Changes)

## Learning Objectives

By completing these exercises, you will:
- ✅ Create migrations from schema changes
- ✅ Review generated SQL for risk
- ✅ Practice phased migrations (nullable → backfill → required)
- ✅ Document a migration strategy like a real team

## Before You Start

**Prerequisites:**
- Completed Level 2 (Prisma basics) and Level 4 (queries)
- A database with existing data (create a few users first)

**Setup:**
1. Navigate to `fs-course-database/level-05-migrations/`
2. Ensure `prisma/schema.prisma` has a `User` model
3. Create an `exercises/` directory

---

## Exercise 1: Add an Optional Field (Low Risk)

**Objective:** Practice a safe, non-breaking schema change.

**Deliverable:** a new migration under `prisma/migrations/`

**Instructions:**
1. Add `phone String?` to `User`
2. Create/apply migration:

```bash
npx prisma migrate dev --name add_phone_to_user
```

**Verification:**
- Migration applies cleanly
- Existing rows are preserved
- Prisma Studio shows the new column

---

## Exercise 2: Phased Migration (Nullable → Backfill → Required)

**Objective:** Practice a production-style workflow for a potentially breaking change.

### Phase A: Add a nullable column

**Deliverable:** migration `add_last_login_nullable`

1. Add to `User`:
   - `lastLoginAt DateTime?`

```bash
npx prisma migrate dev --name add_last_login_nullable
```

### Phase B: Backfill existing rows (script)

**Deliverable:** `exercises/exercise-02_backfill.ts`

Write a script that sets `lastLoginAt` for existing users (e.g., to `createdAt` or `now()`).

### Phase C: Make it required (only after backfill)

**Deliverable:** migration `make_last_login_required`

Change the field to required:
- `lastLoginAt DateTime`

Then create/apply migration:

```bash
npx prisma migrate dev --name make_last_login_required
```

**Verification:**
- You can’t create a user without `lastLoginAt`
- Existing rows still work because you backfilled

---

## Exercise 3: Migration Review Notes (Team Habit)

**Objective:** Practice reviewing migration SQL like a real PR.

**Deliverable:** `exercises/exercise-03_migration_review.md`

In this markdown file, answer:
1. What does each migration do?
2. Did Prisma generate any risky operations?
3. What could lock/slow down production?
4. What would your rollback/recovery plan be?

---

## Running Exercises

```bash
# Create/apply migrations (dev)
npx prisma migrate dev --name <migration_name>

# Review status
npx prisma migrate status

# Run backfill script
npx ts-node exercises/exercise-02_backfill.ts
```

## Verification Checklist

- [ ] I created migrations with descriptive names
- [ ] I reviewed generated SQL for risk
- [ ] I performed a phased change successfully
- [ ] I wrote migration review notes like a real team

## Next Steps

1. ✅ **Practice**: Try a migration that adds a unique constraint (and handle conflicts)
2. ✅ **Experiment**: Identify a change that might lock a large table (conceptually)
3. 📖 **Next Level**: Move to indexes/constraints/optimization
4. 💻 **Complete Exercises**: Continue with [Exercises 06](../level-06-advanced-schema/exercises-06.md)

---

**Key Takeaways:**
- Small migrations are safer and easier to review.
- Phased migrations reduce downtime and deploy-order coupling.
- In production, recovery plans matter more than perfect “rollback”.
