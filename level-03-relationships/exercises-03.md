# Exercises 03: Relationships

## Learning Objectives

By completing these exercises, you will:
- ✅ Create one-to-one relationships
- ✅ Create one-to-many relationships
- ✅ Create many-to-many relationships
- ✅ Query related data with Prisma
- ✅ Understand relationship types
- ✅ Practice database design

## Before You Start

**Prerequisites:**
- Prisma basics (Level 2)
- Understanding of database relationships
- Database set up and running

**Setup:**
1. Navigate to `fs-course-database/level-03-relationships/`
2. Ensure Prisma is configured
3. Database connection ready

---

## Exercise 1: One-to-One

**Objective:** Create one-to-one relationship between User and Profile.

**Instructions:**
Create User and Profile models in `prisma/schema.prisma`:
1. User has one Profile
2. Profile belongs to one User
3. Query user with profile included

**Expected Schema:**
```prisma
// prisma/schema.prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  profile   Profile? // One-to-one (optional - user might not have profile)
  createdAt DateTime @default(now())

  @@map("users")
}

model Profile {
  id        Int      @id @default(autoincrement())
  bio       String?
  avatar    String?
  website   String?
  userId    Int      @unique // One-to-one: unique foreign key
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@map("profiles")
}
```

**Test Queries** (`exercises/exercise-01.ts`):
```typescript
// exercises/exercise-01.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create user with profile
  const user = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice',
      profile: {
        create: {
          bio: 'Software developer',
          website: 'https://alice.dev',
        },
      },
    },
    include: {
      profile: true,
    },
  });

  console.log('User with profile:', user);

  // Query user with profile
  const userWithProfile = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      profile: true,
    },
  });

  console.log('Fetched user with profile:', userWithProfile);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

**Verification Steps:**
1. Create migration: `npx prisma migrate dev --name add_one_to_one`
2. Run test script
3. Verify relationship works
4. Check in Prisma Studio

**Expected Behavior:**
- User can have one profile
- Profile belongs to one user
- Can query with include
- Cascade delete works

**Hints:**
- `@unique` on foreign key = one-to-one
- Optional relation (`Profile?`) = user might not have profile
- `onDelete: Cascade` deletes profile when user deleted

**File:** Update `prisma/schema.prisma` and create `exercises/exercise-01.ts`

---

## Exercise 2: One-to-Many

**Objective:** Create one-to-many relationship.

**Instructions:**
Create User and Post models:
1. User has many Posts
2. Post belongs to one User
3. Query user with all posts

**Expected Schema:**
```prisma
// Add to prisma/schema.prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  posts     Post[]   // One-to-many: array indicates many
  profile   Profile?
  createdAt DateTime @default(now())

  @@map("users")
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  published Boolean  @default(false)
  userId    Int      // Foreign key (not unique = many)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("posts")
}
```

**Test Queries** (`exercises/exercise-02.ts`):
```typescript
// exercises/exercise-02.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create user with multiple posts
  const user = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob',
      posts: {
        create: [
          {
            title: 'First Post',
            content: 'Content of first post',
            published: true,
          },
          {
            title: 'Second Post',
            content: 'Content of second post',
          },
        ],
      },
    },
    include: {
      posts: true,
    },
  });

  console.log('User with posts:', user);
  console.log('Post count:', user.posts.length);

  // Query user with posts
  const userWithPosts = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      posts: {
        where: { published: true }, // Filter posts
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  console.log('User with published posts:', userWithPosts);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

**Verification:**
- User can have multiple posts
- Post belongs to one user
- Can filter and order related data
- Cascade delete works

**File:** Update `prisma/schema.prisma` and create `exercises/exercise-02.ts`

---

## Exercise 3: Many-to-Many

**Objective:** Create many-to-many relationship.

**Instructions:**
Create User and Role models with many-to-many relationship.

**Expected Schema:**
```prisma
// Add to prisma/schema.prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  posts     Post[]
  profile   Profile?
  roles     UserRole[] // Many-to-many through join table
  createdAt DateTime @default(now())

  @@map("users")
}

model Role {
  id        Int        @id @default(autoincrement())
  name      String     @unique
  users     UserRole[] // Many-to-many through join table
  createdAt DateTime   @default(now())

  @@map("roles")
}

// Join table for many-to-many
model UserRole {
  id        Int      @id @default(autoincrement())
  userId    Int
  roleId    Int
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  role      Role     @relation(fields: [roleId], references: [id], onDelete: Cascade)
  assignedAt DateTime @default(now())

  @@unique([userId, roleId]) // Prevent duplicate assignments
  @@map("user_roles")
}
```

**Test Queries** (`exercises/exercise-03.ts`):
```typescript
// exercises/exercise-03.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create roles
  const adminRole = await prisma.role.create({
    data: { name: 'admin' },
  });

  const userRole = await prisma.role.create({
    data: { name: 'user' },
  });

  // Create user with roles
  const user = await prisma.user.create({
    data: {
      email: 'charlie@example.com',
      name: 'Charlie',
      roles: {
        create: [
          { roleId: adminRole.id },
          { roleId: userRole.id },
        ],
      },
    },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });

  console.log('User with roles:', user);
  console.log('User roles:', user.roles.map(ur => ur.role.name));

  // Query user with roles
  const userWithRoles = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });

  console.log('Fetched user with roles:', userWithRoles);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

**Verification:**
- User can have multiple roles
- Role can have multiple users
- Join table manages relationship
- Can query both directions

**Hints:**
- Many-to-many requires join table
- Join table has foreign keys to both models
- Use `include` to fetch related data
- Can filter and order through join table

**File:** Update `prisma/schema.prisma` and create `exercises/exercise-03.ts`

---

## Running Exercises

### Create Migrations

```bash
# For each exercise
npx prisma migrate dev --name add_relationship_name
```

### Test Queries

```bash
npx ts-node exercises/exercise-01.ts
npx ts-node exercises/exercise-02.ts
npx ts-node exercises/exercise-03.ts
```

### View in Prisma Studio

```bash
npx prisma studio
```

## Verification Checklist

After completing all exercises, verify:

- [ ] One-to-one relationship works
- [ ] One-to-many relationship works
- [ ] Many-to-many relationship works
- [ ] Can query with include
- [ ] Can filter related data
- [ ] Cascade deletes work
- [ ] Foreign key constraints enforced

## Troubleshooting

### Issue: Relationship not working

**Solution:**
- Check both sides of relation defined
- Verify foreign key fields match
- Regenerate Prisma Client

### Issue: Cascade delete not working

**Solution:**
- Check `onDelete: Cascade` in schema
- Verify migration applied
- Test delete operation

## Next Steps

1. ✅ **Review**: Understand relationship types
2. ✅ **Experiment**: Add more relationships
3. 📖 **Continue**: Move to [Level 4: Queries and Operations](../level-04-queries-and-operations/lesson-01-crud-operations.md)
4. 💻 **Reference**: Check `project/` folder

---

**Key Takeaways:**
- One-to-one: `@unique` on foreign key
- One-to-many: array on "one" side
- Many-to-many: requires join table
- Use `include` to fetch related data
- Cascade deletes maintain referential integrity
- Relationships enable powerful queries

**Good luck! Happy coding!**
