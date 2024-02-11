const express = require("express");
const { getPosts, createPost } = require("../controllers/postController");
const router = express.Router();

// internal imports

// get all posts
router.get("/", getPosts);

// create post.
router.post("/", createPost);

module.exports = router;
