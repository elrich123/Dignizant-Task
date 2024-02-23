const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require('./controllers/UserController');
const Post = require('./controllers/PostsController');
const Comment = require('./controllers/CommentsController');
const verifyToken = require('./middleware')

//User Routes
router.post('/register', User.registerUser);
router.post('/login', User.login);

//Posts Routes
router.post('/addpost', verifyToken, Post.createPost);
router.get('/getposts', verifyToken, Post.getAllPosts);
router.get('/getpostbyid/:postId', verifyToken, Post.getPostById);
router.put('/updatepost/:postId', verifyToken, Post.updatePost);
router.delete('/deletepost/:postId', verifyToken, Post.deletePost);

//Comments Routes
router.post('/addcomment', verifyToken, Comment.createComment);
router.get('/getcoomentforpost/:postId', verifyToken, Comment.getCommentsForPost);


module.exports = router;