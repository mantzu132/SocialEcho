const Post = require("../models/Post");

function getPosts(req, res, next) {
  Post.find()
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => next(err));
}

const createPost = async (req, res) => {
  const post = req.body;
  const newPost = new Post(post);
  try {
    await newPost.save();
    res.status(201).json("Post created successfully");
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

module.exports = {
  getPosts,
  createPost,
};
