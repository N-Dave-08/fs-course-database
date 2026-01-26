# Lesson 2: Creating Migrations (Long-form Enhanced)

> Creating a migration is easy; creating a *safe* migration is a skill. This lesson focuses on naming, reviewing SQL, and choosing the right workflow for dev vs production.

## Table of Contents

- Creating migrations in development (`migrate dev`)
- Naming migrations for intent
- Reviewing generated SQL (spot risky operations)
- Applying migrations in production (`migrate deploy`)
- Best practices, pitfalls, troubleshooting
- Advanced patterns (preview): phased changes, backfills, lock awareness

## Learning Objectives

By the end of this lesson, you will be able to:
- Create migrations from Prisma schema changes
- Understand what `migrate dev` does (and why it’s dev-focused)
- Choose descriptive migration names that explain intent
- Review generated SQL migrations and identify risky operations
- Apply migrations safely in production using `migrate deploy`

## Why “Creating Migrations” Is a Skill

Creating migrations isn’t just running a command. You’re making a change to a shared system:
- schema evolution affects app code
- production data can be large and sensitive
- migration SQL can lock tables or rewrite data

Good teams treat migrations like code: reviewed, tested, staged.

## Create a Migration (Development)

```bash
npx prisma migrate dev --name add_user_table
```

This typically:
1. detects schema changes
2. creates a new migration in `prisma/migrations/`
3. applies it to your local dev DB
4. regenerates Prisma Client

## Migration Naming

Use descriptive, action-oriented names:
- `add_user_table`
- `add_email_to_users`
- `create_posts_table`
- `add_user_posts_relation`

### Naming tip

Prefer “what changed” over “v2”:
- good: `add_last_login_to_user`
- weak: `update_schema_v2`

## Reviewing Migrations (SQL)

Generated migrations live in `prisma/migrations/`.
You should review:
- dropped columns/tables (data loss)
- column type changes (can rewrite large tables)
- new NOT NULL columns without defaults (can fail)

In a team, migrations should be reviewed in PRs just like code.

## Applying Migrations

### Development

```bash
npx prisma migrate dev
```

### Production

```bash
npx prisma migrate deploy
```

### Why not use `migrate dev` in production?

`migrate dev` is designed for interactive/dev workflows and can behave differently than production-safe deployment flows.
Production should apply pre-generated migrations with `migrate deploy`.

## Real-World Scenario: Adding a Column Safely

If you add a required column to a table with existing rows, you often need a phased approach:
1. add nullable column
2. backfill
3. make it required later

This avoids breaking migrations and keeps deployments safer.

## Best Practices

### 1) Keep migrations small

Small migrations are easier to debug and less risky.

### 2) Test migrations in a staging-like DB

Staging catches issues before production does.

### 3) Coordinate code + migration deployments

Ensure the app version deployed is compatible with the DB schema during rollout (backwards compatibility).

## Common Pitfalls and Solutions

### Pitfall 1: Adding a required field without a default

**Problem:** migration fails because existing rows can’t satisfy NOT NULL.

**Solution:** add nullable first, backfill, then enforce required.

### Pitfall 2: Not regenerating Prisma Client

**Problem:** types in code don’t match schema changes.

**Solution:** ensure generation happens (usually via migrate), or run `prisma generate`.

### Pitfall 3: Applying migrations to the wrong DB

**Problem:** you migrate staging when you thought it was dev.

**Solution:** verify `DATABASE_URL` before running migrations.

## Troubleshooting

### Issue: Migration created but not applied

**Symptoms:**
- DB schema unchanged

**Solutions:**
1. Confirm `migrate dev` was run against the correct DB.
2. Use `prisma migrate status` to see what’s applied.

### Issue: Migration fails with SQL errors

**Symptoms:**
- errors about constraints, types, or existing data

**Solutions:**
1. Review the generated SQL to identify the breaking step.
2. Use a phased approach for breaking changes.
3. Fix data inconsistencies before enforcing constraints.

## Advanced Patterns (Preview)

### 1) Backfills as a deliberate step

Adding a column is one step; populating it for existing rows is another.
Treat backfills as planned work (often a separate migration or controlled script) to avoid long locks.

### 2) Recognizing lock-heavy operations (concept)

Some schema changes can lock or rewrite large tables. Even in Postgres, “small” changes can be expensive at scale.
Review SQL with that in mind and prefer phased approaches.

### 3) Splitting schema and app changes across deploys

If you add a new required field, you often need:
- migration 1: add nullable + deploy code that writes it
- migration 2: enforce NOT NULL after data is populated

## Next Steps

Now that you can create migrations:

1. ✅ **Practice**: Add a new field with a default and migrate
2. ✅ **Experiment**: Add a nullable field, backfill it, then enforce required (two migrations)
3. 📖 **Next Lesson**: Learn about [Migration Strategies](./lesson-03-migration-strategies.md)
4. 💻 **Complete Exercises**: Work through [Exercises 05](./exercises-05.md)

## Additional Resources

- [Prisma Docs: Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)

---

**Key Takeaways:**
- Creating migrations is a production-grade change process.
- Use `migrate dev` for development and `migrate deploy` for production.
- Review generated SQL and plan phased migrations for breaking changes.
