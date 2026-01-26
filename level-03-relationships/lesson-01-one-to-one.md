# Lesson 1: One-to-One Relationships (Long-form Enhanced)

> One-to-one relationships are useful when “extra data is optional” (like a user profile) or when you want to separate concerns (auth vs public profile). The key is enforcing one-to-one with a uniqueness constraint.

## Table of Contents

- Modeling one-to-one (and why `@unique` is required)
- Optional vs required relationships
- Querying safely (`include` vs `select`)
- Best practices, pitfalls, troubleshooting
- Advanced patterns (preview): splitting sensitive fields, enforcing invariants

## Learning Objectives

By the end of this lesson, you will be able to:
- Model a one-to-one relationship in Prisma correctly
- Understand why `@unique` is required to enforce one-to-one
- Query either side of a one-to-one relation using `include`/`select`
- Recognize when one-to-one is the right choice vs merging tables
- Avoid common pitfalls (accidental one-to-many, nullable confusion, overfetching)

## Why One-to-One Matters

One-to-one relationships are useful when:
- an entity has “optional extended data” (user → profile)
- you want to separate concerns (auth fields vs public profile fields)
- you want stricter constraints than “maybe many”

But one-to-one can also add complexity. If data is always present, consider merging into one table.

```mermaid
flowchart LR
  user[User] -->|0..1| profile[Profile]
```

## Modeling One-to-One in Prisma

One user has one profile:

```prisma
model User {
  id      Int     @id @default(autoincrement())
  email   String  @unique
  profile Profile?
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String?
  userId Int    @unique
  user   User   @relation(fields: [userId], references: [id])
}
```

### Why `@unique` matters

`Profile.userId @unique` enforces that each user can appear at most once in `Profile`.
Without it, you could create multiple profiles for the same user (one-to-many).

### Optional vs required

- `profile Profile?` means a user may not have a profile yet
- if you want every user to always have a profile, you’d model and enforce that at app level (and/or create profile automatically)

## Querying One-to-One

### Get user with profile

```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: { profile: true },
});
```

### Get profile with user

```typescript
const profile = await prisma.profile.findUnique({
  where: { userId: 1 },
  include: { user: true },
});
```

### Prefer `select` when you don’t need everything

```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 },
  select: {
    id: true,
    email: true,
    profile: { select: { bio: true } },
  },
});
```

## Real-World Scenario: Splitting Auth Data vs Public Profile Data

Common pattern:
- `User`: email, passwordHash, role, auth settings
- `Profile`: displayName, bio, avatarUrl, public fields

This helps ensure you don’t accidentally expose auth fields when returning profile data.

## Best Practices

### 1) Use one-to-one when the data is optional or separated by concern

If the “child” record is always present and small, merging can be simpler.

### 2) Keep constraints in the database

Use `@unique` on the FK field to enforce one-to-one integrity.

### 3) Avoid overfetching

Prefer `select` when returning data to clients.

## Common Pitfalls and Solutions

### Pitfall 1: Accidental one-to-many

**Problem:** missing `@unique` on `Profile.userId`.

**Solution:** add `@unique` to enforce one-to-one.

### Pitfall 2: “Null explosion”

**Problem:** too many optional fields create lots of null-handling in code.

**Solution:** keep optionality intentional; consider defaults or creating records automatically.

### Pitfall 3: Returning private fields accidentally

**Problem:** you `include: { user: true }` and send the whole user to the client.

**Solution:** use `select` to pick safe fields only.

## Troubleshooting

### Issue: You can create multiple profiles for one user

**Symptoms:**
- multiple rows in `Profile` share the same `userId`

**Solutions:**
1. Add `@unique` on `Profile.userId`.
2. Run a migration and fix existing data.

### Issue: Query returns null for profile

**Symptoms:**
- `user.profile` is null

**Solutions:**
1. Confirm the profile record exists.
2. Ensure the foreign key (`Profile.userId`) matches the user id.

## Advanced Patterns (Preview)

### 1) Splitting sensitive vs public data

A common production pattern is to keep auth/security fields away from “public” profile fields so accidental `include` doesn’t leak sensitive columns.

### 2) Enforcing “required child” invariants

Even if Prisma models `Profile?`, your product might require every user to have one.
Typical approach: create the profile automatically at signup (or on first access) and treat missing profile as a bug.

## Next Steps

Now that you understand one-to-one relationships:

1. ✅ **Practice**: Add a `Profile` model related to `User`
2. ✅ **Experiment**: Use `select` to return only safe profile fields
3. 📖 **Next Lesson**: Learn about [One-to-Many](./lesson-02-one-to-many.md)
4. 💻 **Complete Exercises**: Work through [Exercises 03](./exercises-03.md)

## Additional Resources

- [Prisma Docs: Relations](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)
- [PostgreSQL: Unique constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)

---

**Key Takeaways:**
- One-to-one requires a `@unique` constraint on the foreign key side.
- Model optionality intentionally (`Profile?` is common).
- Use `include` for convenience and `select` for safe, minimal responses.
