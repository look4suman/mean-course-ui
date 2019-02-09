const express = require('express');
const app = express();

app.use("/api/posts", (req, res, next) => {
  const posts = [{
    id: "1",
    title: "title_1",
    content: "content_1"
  }, {
    id: "2",
    title: "title_2",
    content: "content_2"
  }];

  res.status(200).json({
    message: 'posts fetched successfully',
    posts: posts
  });
});

module.exports = app;
