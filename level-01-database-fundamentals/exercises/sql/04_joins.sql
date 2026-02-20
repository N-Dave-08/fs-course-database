SELECT users.name, users.email, posts.title
FROM users
INNER JOIN posts ON users.id = posts.user_id;

SELECT users.name, users.email, posts.title, COUNT(posts.id) as post_count
FROM users
LEFT JOIN posts ON users.id = posts.user_id
GROUP BY users.id, users.name, users.email, posts.title;