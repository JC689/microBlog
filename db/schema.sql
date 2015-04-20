DROP TABLE IF EXISTS authors;
CREATE TABLE authors (
  author_id INTEGER PRIMARY KEY,
  name TEXT
);

DROP TABLE IF EXISTS multiAuth;
CREATE TABLE multiAuth (
	id INTEGER PRIMARY KEY,
	authName TEXT, authId INTEGER, title2 TEXT, body2 TEXT, url2 TEXT,
	postId INTEGER
);



DROP TABLE IF EXISTS post;
CREATE TABLE post (
	post_id INTEGER PRIMARY KEY,
	title TEXT, body TEXT, url TEXT, authorId INTEGER 
	-- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 -- 	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TRIGGER timestamp_update BEFORE UPDATE ON blog BEGIN
--   UPDATE blog SET updated_at = CURRENT_TIMESTAMP WHERE id = new.id;
-- END;