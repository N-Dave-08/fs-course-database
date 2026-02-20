# Exercises 01: Database Fundamentals (SQL First)

## Learning Objectives
By completing these exercises, you will:
- ✅ Connect to PostgreSQL and run SQL safely
- ✅ Create tables with primary keys and foreign keys
- ✅ Practice CRUD with `SELECT` / `INSERT` / `UPDATE` / `DELETE`
- ✅ Use joins to combine related tables
- ✅ Build the mental bridge between “relational concepts” and real SQL

## Before You Start

**Prerequisites:**
- PostgreSQL 16+ running (local install or Docker)
- Ability to run `psql` (or another SQL client)
- Completed Level 1 lessons:
  - `lesson-01-introduction.md`
  - `lesson-02-relational-concepts.md`
  - `lesson-03-sql-basics.md`

**Setup:**
1. Navigate to `fs-course-database/level-01-database-fundamentals/`
2. Create an exercises folder for your deliverables:
   - `exercises/sql/`
3. Decide how you’ll connect:
   - local Postgres (recommended if you already have it)
   - Docker (fine for learning)

**Recommended Docker quick-start (if using Docker):**
```bash
docker run -d \
  --name learn-postgres \
  -e POSTGRES_PASSWORD=mysecret123 \
  -p 5432:5432 \
  postgres:16
```

Then connect with:
```bash
psql -U postgres -h localhost
```
(password: `mysecret123`)

## Exercise 1: Connect and Inspect

**Objective:** Confirm you can connect to Postgres and run basic commands.

**Deliverable:** `exercises/sql/01_connection_notes.md`

**Instructions:**
1. Connect to Postgres using `psql` (or your preferred client).
2. Run:
   - `SELECT 1;`
   - list databases (`\l`)
   - list tables in the current database (`\dt`)

**Run it:**
```bash
psql -U postgres -h localhost
```

**Verify:**
```sql
SELECT 1;
\l
\dt
\conninfo
```

**Verification:**
- You can connect without errors
- `SELECT 1;` returns a single row

## Exercise 2: Create Tables (Users + Posts)

**Objective:** Turn the relational concepts into real tables with constraints.

**Deliverable:** `exercises/sql/02_schema.sql`

**Instructions:**
Create two tables:
1. `users`
2. `posts` with a foreign key to `users`

**Expected shape (guide, not strict):**
- `users`: id (serial primary key), email (unique not null), name (not null), created_at (timestamp default)
- `posts`: id (serial primary key), user_id (references users), title (not null), content, created_at (timestamp default)

**Run it:**
```bash
psql -U postgres -h localhost -f exercises/sql/02_schema.sql
```

**Verify:**
```sql
\d users
\d posts
\dt
```

**Verification:**
- You can run the file without errors
- `\d users` and `\d posts` show:
  - PK on `id`
  - unique constraint on `users.email`
  - FK from `posts.user_id` → `users.id`

## Exercise 3: CRUD (Write Safely)

**Objective:** Practice CRUD and the safety rule: use `WHERE` for updates/deletes.

**Deliverable:** `exercises/sql/03_crud.sql`

**Instructions:**
In `exercises/sql/03_crud.sql`, write SQL statements that:
1. Insert 2 users
2. Insert 3 posts (at least 2 posts for the same user)
3. Select:
   - all users
   - posts for a given `user_id`
4. Update a user’s name (use `WHERE`)
5. Delete a post (use `WHERE`)

**Run it:**
```bash
psql -U postgres -h localhost -f exercises/sql/03_crud.sql
```

**Verify:**
```sql
SELECT * FROM users;
SELECT * FROM posts ORDER BY created_at DESC;
```

**Verification:**
- Running the script creates rows
- Updates and deletes affect only the intended rows

## Exercise 4: Join Queries (Read Like a Real App)

**Objective:** Combine tables with joins.

**Deliverable:** `exercises/sql/04_joins.sql`

**Instructions:**
Write queries that:
1. Return posts with the author’s name and email
2. Return users with a count of posts (include users with 0 posts)

**Hint:** You’ll likely use `INNER JOIN` and `LEFT JOIN`, plus `GROUP BY`.

**Run it:**
```bash
psql -U postgres -h localhost -f exercises/sql/04_joins.sql
```

**Verify:**
```sql
-- (the queries themselves produce the output)
```

**Verification:**
- The first query shows post details together with user name/email
- The second query shows every user, even those with zero posts

## Running Exercises
Use `psql` to run files (one approach):
```bash
psql -U postgres -h localhost -f exercises/sql/02_schema.sql
psql -U postgres -h localhost -f exercises/sql/03_crud.sql
psql -U postgres -h localhost -f exercises/sql/04_joins.sql
```

**Inside psql (alternative):**
```sql
\i exercises/sql/03_crud.sql
```

## Verification Checklist
- [ ] I can connect to Postgres and run basic queries
- [ ] I created `users` and `posts` with correct constraints
- [ ] I can insert, update, and delete safely (with `WHERE`)
- [ ] I can join users and posts to produce “app-shaped” results

## Next Steps
Now that you understand database fundamentals in SQL:
1. ✅ **Practice**: Add one more table (e.g., `comments`) with FKs
2. ✅ **Experiment**: Add an index on `posts.user_id` (preview for Level 6)
3. 📖 **Next Level**: Move to Prisma basics (typed schema + client)
4. 💻 **Complete Exercises**: Continue with [Exercises 02](../level-02-prisma-basics/exercises-02.md)

**Key Takeaways:**
- SQL is how you create and query relational data.
- Constraints (PK/unique/FK) protect correctness even when apps are buggy.
- Joins are the “relational superpower” for combining entities.