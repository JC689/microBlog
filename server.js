// require express
var express = require("express");
var app = express();

// require ejs
var ejs = require('ejs');
app.set('view_engine', 'ejs');

// require sqlite3
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./db/blog.db');

// enables POST to parse body
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

// enables put and delete
var override = require("method-override");
app.use(override("_method"));



// -------------------LOGIN----------------------


// redirect to /blog
app.get('/', function(req, res) {
	res.redirect('/login');
});
var id;
var isUser;
// add user
app.post('/login', function(req, res) {
	var newUser = req.body.name;

	db.get("SELECT author_id FROM authors WHERE name = ?", newUser, function(err,data){
		id = data;
		id = id.author_id;
		
		if(id === undefined || id === NaN){
			db.run("INSERT INTO authors (name) VALUES (?);", newUser, function(err){if(err){throw err}});
		}

		res.redirect('/author/'+id+'/feed');
	});
});

// get all users
app.get('/login', function(req, res) {
	db.all("SELECT * FROM authors;" , function(err, data) {
		if(err){
			throw err;
		} else {
			var user = data;
			console.log(user);
			res.render('signin.ejs', {user: user});
		}
	});
});


// ---------------NEWS FEED-------------------------------

// get user feed
app.get('/author/:id/feed', function(req, res) {
	var id = parseInt(req.params.id);

	var authors_id;

	var posts;
	var postAuthorId;

	var authors;

	// get all posts
	db.get("SELECT * FROM authors WHERE author_id = ?;", id, function(err,data){
		authors_id = data;
		
		// gets all posts from that author
		db.all("SELECT * FROM post;", function(err,data){
			posts = data;
			
			db.all("SELECT * FROM authors;", function(err,data) {
				authors = data;
				console.log(authors);



				res.render('feed.ejs', {authors_id: authors_id, posts: posts, authors: authors});

			});
		});
	});
});

// ----------------- other blogs ---------------------

app.get('/authors', function(req, res) {
	db.all("SELECT * FROM authors;", function(err, data) {
		var allAuthors = data;
		res.render('allAuthors.ejs', {allAuthors: allAuthors});
	});
});

app.get('/authors/:id', function(req, res) {
	var id = parseInt(req.params.id);
	db.all("SELECT * FROM post WHERE authorId = ?;", id, function(err, data) {
		var posts = data;
		db.get("SELECT name FROM authors WHERE author_id = ?;", id, function(err,data){
			var authors = data;
			var authorsName = authors.name;
			

			res.render('viewAuthorBlog.ejs', {posts:posts, authors: authors});
		});
	});
});

// --------------- personal author blog --------------------


app.get('/author/:id', function(req, res) {
	var id = parseInt(req.params.id);

	var authorId;
	var posts;
	var addAuthor;
	var multiAuth;
	var authId;

	db.get("SELECT * FROM authors WHERE author_id = ?;", id, function(err,data){
		authorId = data;
		console.log(authorId);
		var authorIdNum = parseInt(authorId.author_id);
		console.log(authorIdNum);


		// gets all posts from that author
		db.all("SELECT * FROM authors INNER JOIN post ON author_id = post.authorId WHERE authorId = ?;", authorIdNum, function(err,data){
			posts = data;
			console.log(posts);
			// get post id
			db.all("SELECT * FROM authors;", function(err,data){
				addAuthor = data;

				db.get("SELECT authId FROM post INNER JOIN multiAuth ON post_id = multiAuth.postId WHERE postId = ?;", authorIdNum, function(err,data){
					multiAuth = data;
					authId = multiAuth.authId;
					

					db.all("SELECT * FROM multiAuth WHERE authId = ?;", authId, function(err,data){
						var multiPost = data;

					
						res.render('authorBlog.ejs', {authorId: authorId, posts: posts, addAuthor: addAuthor, multiPost: multiPost});
					});
					
				});
			});
		});
	});
});


// user can post on blog
app.post('/author/:id', function(req, res) {
	var id = parseInt(req.params.id);
	var title = req.body.title;
	var body = req.body.body;
	var url = req.body.url;
	var authorId = req.body.authorId;
	var name = req.body.name;
	var none = req.body.none;
	
	// insert post into micro blog
	if(none = true){
		db.run("INSERT INTO post (title, body, url, authorId) VALUES (?,?,?,?);", title, body, url, id, function(err){if(err){throw err}});
	} else if(authorId = true) {
		// insert mulit authors into a post
		db.run("INSERT INTO multiAuth (authName, postId) VALUES (?,?);", name, authorId, function(err){if(err){throw err}});
		db.run("INSERT INTO post (title, body, url, authorId) VALUES (?,?,?,?);", title, body, url, id, function(err){if(err){throw err}});

	}

	res.redirect('/author/'+id);
});


// ------------------Edit a Post------------------------


app.get('/author/:id/edit/:post', function(req,res) {
	var id = parseInt(req.params.id);
	var post = parseInt(req.params.post);
	
	var posts;
	var postsId;
	
	db.get("SELECT * FROM authors WHERE author_id = ?;", id, function(err,data){
		authorId = data;
		console.log(authorId);
		var authorIdNum = parseInt(authorId.author_id);
		console.log(authorIdNum);
		// gets all posts from that author
		db.get("SELECT post_id FROM post WHERE post_id = ?;", post, function(err,data){
			posts = data;
			postsId = posts.post_id;
			

			res.render("edit.ejs", {authorId: authorId, posts: posts, postsId: postsId});
		});
	});
});

app.put('/author/:id/edit/:post', function(req, res){
	var id = parseInt(req.params.id);
	var post = parseInt(req.params.post);
	var title = req.body.title;
	var body = req.body.body;
	var url = req.body.url;

	db.run("UPDATE post SET title = ?, body = ?, url = ? WHERE post_id = ?;", title, body, url, post, function(err){if(err){throw err}});

	res.redirect('/author/'+id);

});

// delete a post
app.delete('/author/:id/edit/:post', function(req,res){
	var id = parseInt(req.params.id);
	var post = parseInt(req.params.post);

	delete db.run("DELETE FROM post WHERE post_id = ?;", post, function(err){if(err){throw err}});

	res.redirect('/author/'+id);
})

// server on
app.listen(3000, function () {
	console.log("Server listening on port: 3000");
});