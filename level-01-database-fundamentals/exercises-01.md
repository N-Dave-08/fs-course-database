```markdown
# Exercises 01: Database Fundamentals (SQL First)

## Learning Objectives
By completing these exercises, you will:
- ✅ Connect to PostgreSQL (Docker or local) and run SQL safely
- ✅ Create tables with primary keys, unique constraints and foreign keys
- ✅ Practice safe **CRUD** with `INSERT` / `SELECT` / `UPDATE` / `DELETE`
- ✅ Use `JOIN`s to combine related tables
- ✅ Build confidence reading psql prompts and fixing common errors

## Before You Start

**Prerequisites:**
- Docker installed and running (or local PostgreSQL 16+)
- Basic terminal usage
- Completed Level 1 lessons:
  - `lesson-01-introduction.md`
  - `lesson-02-relational-concepts.md`
  - `lesson-03-sql-basics.md`

**Recommended Setup (Docker – clean & isolated)**

1. Create and start PostgreSQL container (do this once):

```bash
docker run -d \
  --name learn-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=mysecret123 \
  -e POSTGRES_DB=appdb \
  -p 5432:5432 \
  -v pg-learn-data:/var/lib/postgresql/data \
  postgres:16
```

2. Test connection from your terminal:

```bash
# Option A – superuser (easiest for learning)
psql -U postgres -h localhost -d appdb

# Option B – if you created user Dave earlier
psql -U dave -h localhost -d appdb
```

Enter password (`mysecret123` or whatever you set).

3. Create working folder:

```bash
mkdir -p fs-course-database/level-01-database-fundamentals/exercises/sql
cd fs-course-database/level-01-database-fundamentals
```

## Exercise 1: Connect and Inspect

**Deliverable:** `exercises/sql/01_connection_notes.md`

**Instructions:**

1. Connect using one of the commands above
2. Run these commands and note the output:

```sql
SELECT 1;
\l                 -- list all databases
\conninfo          -- show current connection
\dt                -- list tables in current database
SELECT version();  -- PostgreSQL version
```

**Common fixes:**
- password error → check what you set in `-e POSTGRES_PASSWORD=`
- connection refused → make sure container is running (`docker ps`)

## Exercise 2: Create Tables (Users + Posts)

**Deliverable:** `exercises/sql/02_schema.sql`

**Instructions:**

Create this file with safe, re-runnable DDL:

```sql
-- exercises/sql/02_schema.sql
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    email       TEXT NOT NULL UNIQUE,
    name        TEXT NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users(id),
    title       TEXT NOT NULL,
    content     TEXT,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

Run it:

```bash
psql -U postgres -h localhost -d appdb -f exercises/sql/02_schema.sql
```

Verify:

```sql
\d users
\d posts
```

## Exercise 3: CRUD (Write Safely)

**Deliverable:** `exercises/sql/03_crud.sql`

**Instructions:**

Write **safe / re-runnable** statements:

```sql
-- exercises/sql/03_crud.sql

-- Insert users safely (skip if already exist)
INSERT INTO users (email, name)
VALUES 
    ('bob@domain.com',   'Bob'),
    ('jacob@domain.com', 'Jacob')
ON CONFLICT (email) DO NOTHING;

-- Remember the IDs (or query them)
-- SELECT id, email, name FROM users;

-- Insert posts (use real user IDs from the query above)
INSERT INTO posts (user_id, title, content)
VALUES
    (1, 'Bob''s first post',   'Hello from Bob! This is my first post.'),
    (1, 'Bob''s second post',  'Another thought from Bob.'),
    (2, 'Jacob''s intro',      'Hi, I''m Jacob and this is my first post.')
ON CONFLICT DO NOTHING;

-- Select examples
SELECT * FROM users ORDER BY id;
SELECT * FROM posts ORDER BY id;

-- Example update (always use WHERE!)
UPDATE users 
SET name = 'Robert'
WHERE email = 'bob@domain.com';

-- Example delete (always use WHERE!)
DELETE FROM posts 
WHERE title = 'Bob''s second post';
```

**Important notes:**
- Use **single quotes `' '`** for strings — **not double quotes**
- To escape apostrophe inside string → use two single quotes: `Bob''s`
- Run the file multiple times → it should not error (thanks to `ON CONFLICT DO NOTHING`)

Run:

```bash
psql -U postgres -h localhost -d appdb -f exercises/sql/03_crud.sql
```

## Exercise 4: Join Queries (Read Like a Real App)

**Deliverable:** `exercises/sql/04_joins.sql`

**Instructions:**

```sql
-- 1. Posts with author name & email
SELECT 
    p.id,
    p.title,
    p.content,
    u.name AS author,
    u.email
FROM posts p
INNER JOIN users u ON p.user_id = u.id
ORDER BY p.created_at DESC;

-- 2. Users + post count (including users with 0 posts)
SELECT 
    u.id,
    u.name,
    u.email,
    COUNT(p.id) AS post_count
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
GROUP BY u.id, u.name, u.email
ORDER BY post_count DESC, u.name;
```

Run & verify output looks like real application data.

## Running Exercises – Quick Reference

```bash
# One-time connection test
psql -U postgres -h localhost -d appdb

# Run any file
psql -U postgres -h localhost -d appdb -f exercises/sql/02_schema.sql
psql -U postgres -h localhost -d appdb -f exercises/sql/03_crud.sql
psql -U postgres -h localhost -d appdb -f exercises/sql/04_joins.sql

# Or inside psql:
\i exercises/sql/03_crud.sql
```

**Helpful psql commands when stuck:**
- `\reset`          – clear unfinished query
- Ctrl+C            – cancel current input
- `\q`              – quit psql
- `\h INSERT`       – show syntax help
- `\set ECHO all`   – see more verbose output

## Verification Checklist
- [ ] Can connect and run `SELECT 1;`
- [ ] Tables `users` and `posts` created with correct constraints
- [ ] Can run `03_crud.sql` multiple times without errors
- [ ] Updates & deletes only affect intended rows (used `WHERE`)
- [ ] Joins return meaningful combined results

## Next Steps
- Add a `comments` table with foreign keys to `posts` and `users`
- Create an index: `CREATE INDEX ON posts(user_id);`
- Move to Prisma / ORM layer in the next level

**Key Takeaways (updated)**
- Use **single quotes** for string values
- Always write `WHERE` when updating/deleting
- `ON CONFLICT … DO NOTHING` makes scripts re-runnable
- psql prompt changes (`#` vs `'#`) tell you when something is wrong
- Constraints save you from bad data — even when your app code has bugs
```