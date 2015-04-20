INSERT INTO authors (name) VALUES ("John");
INSERT INTO authors (name) VALUES ("Mike");

INSERT INTO post (title, body, url, authorId) VALUES ("Hello from John", "Welcome to my Blog", "www.johncostanza.us", 1);
INSERT INTO post (title, body, url, authorId) VALUES ("Hello from Mike", "Welcome to my Blog with John", "www.mike.com", 2);

INSERT INTO multiAuth (authName, authId, title2, body2, url2, postId) VALUES ("John", 1, "Hello from Mike", "Welcome to my Blog with John", "www.mike.com", 2);
INSERT INTO multiAuth (authName, authId, title2, body2, url2, postId) VALUES ("Mike", 2, "Hello from John", "Welcome to my Blog with Mike", "www.john.com", 1);