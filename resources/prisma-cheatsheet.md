# Prisma Cheatsheet

## Basic Queries

```typescript
// Find many
const users = await prisma.user.findMany();

// Find unique
const user = await prisma.user.findUnique({ where: { id: 1 } });

// Create
const user = await prisma.user.create({ data: { email: '...', name: '...' } });

// Update
const user = await prisma.user.update({ where: { id: 1 }, data: { name: '...' } });

// Delete
await prisma.user.delete({ where: { id: 1 } });
```

## Filtering

```typescript
const users = await prisma.user.findMany({
  where: {
    email: { contains: '@example.com' },
    age: { gte: 18 }
  }
});
```

## Relations

```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: { posts: true }
});
```
