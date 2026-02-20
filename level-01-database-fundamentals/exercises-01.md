# Exercises 01: Database Fundamentals (SQL First)

## Learning Objectives
By completing these exercises, you will:
- ✅ Connect to PostgreSQL (Docker or local) and run SQL safely
- ✅ Create tables with primary keys, unique constraints and foreign keys
- ✅ Practice safe **CRUD** with `INSERT` / `SELECT` / `UPDATE` / `DELETE`
- ✅ Use `JOIN`s to combine related tables
- ✅ Build confidence reading psql prompts and fixing common beginner errors

## Before You Start

**Prerequisites:**
- Docker installed and running (recommended for clean, isolated environment)  
  **OR** local PostgreSQL 16+ installed
- Basic terminal / command-line usage
- Completed Level 1 theory lessons:
  - `lesson-01-introduction.md`
  - `lesson-02-relational-concepts.md`
  - `lesson-03-sql-basics.md`

**Recommended Setup – Docker (clean & disposable)**

1. Start a PostgreSQL container (run once):

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

2. Test the connection:

```bash
# Superuser connection (easiest for learning)
psql -U postgres -h localhost -d appdb
```

Enter password: `mysecret123`

(If connection fails → check `docker ps` to confirm container is running)

3. Create your working directory:

```bash
mkdir -p fs-course-database/level-01-database-fundamentals/exercises/sql
cd fs-course-database/level-01-database-fundamentals
```

## Exercise 1: Connect and Inspect

**Objective:** Confirm connection works and become familiar with basic psql commands.

**Deliverable:** `exercises/sql/01_connection_notes.md`

**Instructions:**

1. Connect using the command above
2. Run and observe the output of:

```sql
SELECT 1;

\l                   -- list all databases
\conninfo            -- show current connection details
\dt                  -- list tables in current database
SELECT version();    -- PostgreSQL server version
SELECT current_user; -- who am I connected as?
```

**Tips & Common Fixes:**
- Password prompt → use `mysecret123` (or whatever you set)
- "Connection refused" → container not running (`docker start learn-postgres`)
- Prompt stuck on `postgres-#` or `postgres'#` → press Ctrl+C or type `\reset`

**Deliverable:** Create `01_connection_notes.md` and write 3–5 sentences about what you observed.

## Exercise 2: Create Tables (Users + Posts)

**Objective:** Define relational structure with proper constraints.

**Deliverable:** `exercises/sql/02_schema.sql`

**Instructions:**

Create this file (make it re-runnable with `DROP … IF EXISTS`):

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

**Verify:**

```sql
\d users
\d posts
\dt
```

Expected: two tables with correct PK, UNIQUE, and FOREIGN KEY constraints.

## Exercise 3: CRUD (Write Safely)

**Objective:** Practice creating, reading, updating, and deleting data — safely.

**Deliverable:** `exercises/sql/03_crud.sql`

**Instructions:**

Create this file (designed to be re-runnable without duplicate errors):

```sql
-- exercises/sql/03_crud.sql

-- 1. Insert users safely
INSERT INTO users (email, name)
VALUES 
    ('bob@domain.com',   'Bob'),
    ('jacob@domain.com', 'Jacob')
ON CONFLICT (email) DO NOTHING;

-- 2. Insert posts (use actual IDs from users table – these assume id=1 & id=2)
INSERT INTO posts (user_id, title, content)
VALUES
    (1, 'Bob''s first post',   'Hello! This is my first post content.'),
    (1, 'Bob''s second post',  'Another thought from me.'),
    (2, 'Jacob''s intro',      'Hi everyone, I''m Jacob.')
ON CONFLICT DO NOTHING;

-- 3. Read examples
SELECT id, email, name FROM users ORDER BY id;
SELECT id, user_id, title, content FROM posts ORDER BY created_at DESC;

-- 4. Update (always use WHERE!)
UPDATE users 
SET name = 'Robert'
WHERE email = 'bob@domain.com';

-- 5. Delete (always use WHERE!)
DELETE FROM posts 
WHERE title ILIKE '%second post%';
```

**Important notes:**
- Always use **single quotes `' '`** for string literals
- Escape apostrophes inside strings with **two single quotes**: `Bob''s`
- `ON CONFLICT … DO NOTHING` prevents errors when re-running the file

Run:

```bash
psql -U postgres -h localhost -d appdb -f exercises/sql/03_crud.sql
```

Verify changes:

```sql
SELECT * FROM users;
SELECT * FROM posts;
```

## Exercise 4: Join Queries (Read Like a Real App)

**Objective:** Combine data from multiple tables.

**Deliverable:** `exercises/sql/04_joins.sql`

**Instructions:**

```sql
-- exercises/sql/04_joins.sql

-- 1. All posts with author name & email
SELECT 
    p.id,
    p.title,
    LEFT(p.content, 60) || '...' AS preview,
    u.name AS author,
    u.email
FROM posts p
INNER JOIN users u ON p.user_id = u.id
ORDER BY p.created_at DESC;

-- 2. Users with their post count (including users with zero posts)
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

Run:

```bash
psql -U postgres -h localhost -d appdb -f exercises/sql/04_joins.sql
```

## Running Exercises – Quick Reference

```bash
# Interactive session
psql -U postgres -h localhost -d appdb

# Run any file
psql -U postgres -h localhost -d appdb -f exercises/sql/02_schema.sql

# Inside psql (after connecting)
\i exercises/sql/03_crud.sql
```

**Helpful psql rescue commands:**
- `\reset`       → clear stuck buffer
- Ctrl+C         → cancel current input
- `\q`           → quit
- `\h INSERT`    → syntax help for any command

## Verification Checklist
- [ ] Can connect and run basic queries
- [ ] Tables created with correct constraints (PK, UNIQUE, FK)
- [ ] `03_crud.sql` runs multiple times without duplicate errors
- [ ] Updates & deletes only affect targeted rows (used `WHERE`)
- [ ] Joins return meaningful combined results

## Next Steps
- Experiment: Add a `comments` table with foreign keys
- Preview performance: `CREATE INDEX ON posts(user_id);`
- Move forward: Start Prisma / ORM in Level 02

**Key Takeaways**
- Single quotes `' '` for strings — double quotes `"` are for identifiers
- Always write `WHERE` when updating or deleting
- Use `ON CONFLICT … DO NOTHING` for safe, repeatable scripts
- psql prompt changes warn you when input is incomplete or malformed
- Constraints (PK/UNIQUE/FK) protect data integrity automatically