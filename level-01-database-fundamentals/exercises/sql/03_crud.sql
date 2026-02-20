INSERT INTO users (email, name) VALUES ('bob@domain.com', 'Bob');
INSERT INTO users (email, name) VALUES ('Jacob@domain.com', 'Jacob');

INSERT INTO posts (user_id, title, content) VALUES (1, 'Bob''s posts', 'this is Bob''s post');
INSERT INTO posts (user_id, title, content) VALUES (2, 'Jacob''s posts', 'this is Jacob''s post');

UPDATE users SET name = 'Bob updated' WHERE id = 1;
UPDATE posts SET title = 'Bob''s title updated' WHERE user_id = 1;

DELETE FROM posts WHERE user_id = 2;