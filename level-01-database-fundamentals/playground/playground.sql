-- retrieve data
SELECT * FROM users
SELECT name, email FROM users
SELECT * FROM users WHERE age > 18

-- common patterns
SELECT * FROM users ORDER BY created_at DESC
SELECT * FROM users ORDER BY id ASC LIMIT 20 OFFSET 0

-- add data
INSERT INTO users (name, email) VALUE ('Alice', 'alice@domain.com')

-- returning inserted rows (postgres)
INSERT INTO users (name, email)
VALUES ('Alice', 'alice@domain.com')
RETURNING id, name, email

-- modify data:
UPDATE users SET name = 'Alice updated' WHERE id = 1

-- remove data:
DELETE FROM users WHERE id = 1

-- combine tables:
SELECT users.name, post.title
FROM users
INNER JOIN posts ON users.id = posts.user_id

