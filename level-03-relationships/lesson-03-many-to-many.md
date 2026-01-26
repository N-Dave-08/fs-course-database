# Lesson 3: Many-to-Many Relationships (Long-form Enhanced)

> Many-to-many relationships unlock flexible tagging/roles/categorization, but they’re also where schemas can get messy fast. This lesson shows when implicit relations are enough and when you need an explicit join model.

## Table of Contents

- Implicit many-to-many (simple)
- Explicit join tables (relationship metadata)
- Querying + managing links (`connect`/`disconnect`)
- Best practices, pitfalls, troubleshooting
- Advanced patterns (preview): preventing duplicates, indexing join tables, role modeling

## Learning Objectives

By the end of this lesson, you will be able to:
- Model many-to-many relationships in Prisma (implicit and explicit join tables)
- Understand when you need an explicit join model (metadata on the relationship)
- Query many-to-many relationships using `include` and nested `select`
- Create/remove links between entities safely
- Recognize common pitfalls (duplicate links, missing uniqueness, overfetching large graphs)

## Why Many-to-Many Matters

Many-to-many relationships are common:
- users ↔ roles
- students ↔ courses
- products ↔ categories

They allow flexible associations without duplicating data.

```mermaid
flowchart LR
  user[User] <-->|many-to-many| role[Role]
```

## Many-to-Many in Prisma (Implicit)

Users can have many roles, roles can have many users:

```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  roles Role[]
}

model Role {
  id    Int    @id @default(autoincrement())
  name  String @unique
  users User[]
}
```

### What Prisma does under the hood

Prisma will create an implicit join table (implementation detail) to store the links.
This is great when you only need the relationship itself.

## When to Use an Explicit Join Table

Use an explicit join model when the relationship needs metadata:
- when the role was granted
- who granted it
- expiration dates

Example:

```prisma
model User {
  id    Int        @id @default(autoincrement())
  roles UserRole[]
}

model Role {
  id    Int        @id @default(autoincrement())
  users UserRole[]
}

model UserRole {
  userId Int
  roleId Int
  assignedAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id])
  role Role @relation(fields: [roleId], references: [id])

  @@id([userId, roleId]) // composite primary key prevents duplicates
}
```

## Querying Many-to-Many

### Get user with roles (implicit)

```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: { roles: true },
});
```

### Get role with users (implicit)

```typescript
const role = await prisma.role.findUnique({
  where: { id: 1 },
  include: { users: true },
});
```

### Prefer `select` to avoid huge payloads

```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 },
  select: {
    id: true,
    email: true,
    roles: { select: { id: true, name: true } },
  },
});
```

## Creating and Removing Links

With an implicit many-to-many, you typically connect/disconnect:

```typescript
await prisma.user.update({
  where: { id: 1 },
  data: {
    roles: {
      connect: { id: 2 },
    },
  },
});
```

Disconnect:

```typescript
await prisma.user.update({
  where: { id: 1 },
  data: {
    roles: {
      disconnect: { id: 2 },
    },
  },
});
```

## Real-World Scenario: RBAC (Role-Based Access Control)

Many-to-many is commonly used for roles:
- a user can have multiple roles
- a role can be assigned to many users

You can then enforce authorization based on roles.

## Best Practices

### 1) Prevent duplicate links

Explicit join tables should use a composite key (`@@id([userId, roleId])`) or unique index.

### 2) Avoid fetching large graphs by default

Many-to-many can explode response sizes quickly—prefer `select`.

### 3) Keep joins intentional

Only include relations when needed for a specific endpoint/UI.

## Common Pitfalls and Solutions

### Pitfall 1: Huge payloads (graph explosion)

**Problem:** You include user → roles → users → roles → ...

**Solution:** use `select` and avoid deep includes unless necessary.

### Pitfall 2: Duplicate assignments

**Problem:** user gets the same role multiple times (explicit join tables).

**Solution:** add composite keys/unique constraints.

### Pitfall 3: Treating roles as strings everywhere

**Problem:** inconsistent role names and typos.

**Solution:** model roles as rows (or enums) and centralize allowed role names.

## Troubleshooting

### Issue: Connect fails with “record not found”

**Symptoms:**
- connect throws because the role/user doesn’t exist

**Solutions:**
1. Confirm the related record exists.
2. Validate IDs and return clear 400/404 errors in your API.

### Issue: Queries are slow when including roles/users

**Symptoms:**
- many-to-many queries return large datasets

**Solutions:**
1. Use `select` to return less data.
2. Add indexes on join columns (covered later).

## Advanced Patterns (Preview)

### 1) Indexing explicit join tables

Explicit join tables often need indexes for common access patterns:
- by `userId`
- by `roleId`
Even with a composite primary key, you may add additional indexes depending on your queries.

### 2) Preventing duplicates (beyond “best effort”)

Rely on database guarantees:
- composite primary key (`@@id([userId, roleId])`) or `@@unique`
Then handle the unique violation in your API (return 409 or idempotent success).

### 3) Roles as rows vs enums (trade-off)

- **rows**: dynamic, manageable in admin UI, but needs seed/management
- **enums**: compile-time safe, but migrations required to change

## Next Steps

Now that you understand many-to-many:

1. ✅ **Practice**: Model users ↔ roles and assign roles with `connect`
2. ✅ **Experiment**: Convert to an explicit join model and add `assignedAt`
3. 📖 **Next Level**: Move into queries and operations
4. 💻 **Complete Exercises**: Work through [Exercises 03](./exercises-03.md)

## Additional Resources

- [Prisma Docs: Many-to-many relations](https://www.prisma.io/docs/concepts/components/prisma-schema/relations/many-to-many-relations)

---

**Key Takeaways:**
- Many-to-many can be implicit (simple) or explicit (when you need metadata).
- Use `connect`/`disconnect` to manage relationships.
- Use composite keys/unique constraints to prevent duplicates in explicit join tables.
- Avoid overfetching large relation graphs; prefer `select`.
