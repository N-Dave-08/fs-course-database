# SQL Cheatsheet

## Basic Queries

```sql
SELECT * FROM users;
SELECT name, email FROM users;
SELECT * FROM users WHERE age > 18;
SELECT * FROM users ORDER BY name ASC;
SELECT * FROM users LIMIT 10;
```

## JOINs

```sql
SELECT users.name, posts.title
FROM users
INNER JOIN posts ON users.id = posts.userId;

SELECT users.name, posts.title
FROM users
LEFT JOIN posts ON users.id = posts.userId;
```

## Aggregations

```sql
SELECT COUNT(*) FROM users;
SELECT AVG(age) FROM users;
SELECT MAX(createdAt) FROM posts;
SELECT userId, COUNT(*) FROM posts GROUP BY userId;
```

## Modifications

```sql
INSERT INTO users (email, name) VALUES ('alice@example.com', 'Alice');
UPDATE users SET name = 'Updated' WHERE id = 1;
DELETE FROM users WHERE id = 1;
```
